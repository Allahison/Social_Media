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
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

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
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ post_id: postId, user_id: userId });

        if (error) throw error;

        await supabase
          .from('like_notifications')
          .delete()
          .match({ sender_id: userId, post_id: postId });
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: userId }]);

        if (error) throw error;

        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .single();

        if (!postError && postData?.user_id !== userId) {
          await supabase.from('like_notifications').insert({
            sender_id: userId,
            receiver_id: postData.user_id,
            post_id: postId,
            type: 'like',
          });
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
    setIsCommentModalOpen(prev => !prev);
  };

  return (
    <div className="interaction-wrapper">
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
      </div>

      {isCommentModalOpen && (
        <div className="comment-modal-container">
          <CommentModal
            postId={postId}
            userId={userId}
            onClose={() => setIsCommentModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
