import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import './InteractionBar.css';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import CommentModal from './CommentModal/CommentModal';

export default function InteractionBar({ postId, user }) {
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false); // ✅ Renamed for clarity

  useEffect(() => {
    if (user && postId) {
      fetchLikes();
    }
  }, [user, postId]);

  const fetchLikes = async () => {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId);

    if (!error) {
      setLikesCount(data.length);
      setHasLiked(data.some((like) => like.user_id === user.id));
    } else {
      console.error('❌ Error fetching likes:', error.message);
    }

    setLoading(false);
  };

  const toggleLike = async () => {
    if (!user || !postId) return;
    setLoading(true);

    if (hasLiked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .match({ post_id: postId, user_id: user.id });
      if (error) console.error('❌ Unlike error:', error.message);
    } else {
      const { error } = await supabase
        .from('likes')
        .insert([{ post_id: postId, user_id: user.id }]);
      if (error) console.error('❌ Like error:', error.message);
    }

    await fetchLikes();
    setLoading(false);
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <>
      <div className="interaction-bar">
        {/* Like Count */}
        {likesCount > 0 && (
          <div className="like-count-display">
            <FaThumbsUp className="blue-icon" />
            <span>{likesCount}</span>
          </div>
        )}

        <hr className="separator" />

        {/* Action Buttons */}
        <div className="post-actions">
          <button
            className={`action-button ${hasLiked ? 'liked' : ''}`}
            onClick={toggleLike}
            disabled={loading}
          >
            <FaThumbsUp />
            {hasLiked ? 'Liked' : 'Like'}
          </button>

          <button
            className="action-button"
            onClick={toggleComments} // ✅ Toggle comments
          >
            <FaComment /> Comment
          </button>

          <button
            className="action-button"
            onClick={() => alert('🔗 Share feature coming soon')}
          >
            <FaShare /> Share
          </button>
        </div>
      </div>

      {/* ✅ Comment Modal Render */}
      {showComments && (
        <CommentModal
          postId={postId}
          user={user}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
}
