// src/components/createpost/intraction/InteractionBar.jsx

import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import './InteractionBar.css';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import CommentModal from '../intraction/CommentModal/CommentModal';

export default function InteractionBar({ postId, userId, onRefresh }) {
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  useEffect(() => {
    fetchLikes();
  }, [postId, userId]);

  const fetchLikes = async () => {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId);

    if (!error && data) {
      setLikesCount(data.length);
      setHasLiked(data.some((like) => like.user_id === userId));
    } else {
      console.error('❌ Error fetching likes:', error?.message);
    }
  };

  const toggleLike = async () => {
    if (!userId || !postId) return;
    setLoading(true);

    try {
      if (hasLiked) {
        // ❌ Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ post_id: postId, user_id: userId });
        if (error) throw error;

        // ❌ Delete notification
        const { error: notifDeleteError } = await supabase
          .from('like_notifications')
          .delete()
          .match({ sender_id: userId, post_id: postId });
        if (notifDeleteError) {
          console.error('❌ Failed to delete notification:', notifDeleteError.message);
        }
      } else {
        // ✅ Like
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: userId }]);
        if (error) throw error;

        // ✅ Add like notification
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .single();

        if (!postError && postData && postData.user_id !== userId) {
          const { error: notifInsertError } = await supabase
            .from('like_notifications')
            .insert({
              sender_id: userId,
              receiver_id: postData.user_id,
              post_id: postId,
              type: 'like',
            });
          if (notifInsertError) {
            console.error('❌ Failed to insert notification:', notifInsertError.message);
          }
        }
      }

      await fetchLikes();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('❌ Like/unlike failed:', err.message);
    }

    setLoading(false);
  };

  const toggleCommentModal = () => {
    setCommentModalOpen((prev) => !prev);
  };

  return (
    <div className="interaction-bar">
      <button
        className={`interaction-button ${hasLiked ? 'liked' : ''}`}
        onClick={toggleLike}
        disabled={loading}
      >
        <FaThumbsUp /> {hasLiked ? 'Liked' : 'Like'} ({likesCount})
      </button>

      <button className="interaction-button" onClick={toggleCommentModal}>
        <FaComment /> Comment
      </button>

      <button className="interaction-button">
        <FaShare /> Share
      </button>

      {commentModalOpen && (
        <CommentModal
          postId={postId}
          userId={userId}
          onClose={() => setCommentModalOpen(false)}
        />
      )}
    </div>
  );
}
