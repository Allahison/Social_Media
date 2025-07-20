import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import './InteractionBar.css';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import CommentModal from './CommentModal/CommentModal';

export default function InteractionBar({ postId, userId, onRefresh }) {
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // ✅ Real-time like updates
  useEffect(() => {
    if (!userId || !postId) return;

    fetchLikes();

    const subscription = supabase
      .channel('likes_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes',
          filter: `post_id=eq.${postId}`,
        },
        () => fetchLikes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId, postId]);

  const fetchLikes = async () => {
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId);

    if (!error) {
      setLikesCount(data.length);
      setHasLiked(data.some((like) => like.user_id === userId));
    } else {
      console.error('❌ Error fetching likes:', error.message);
    }

    setLoading(false);
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
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: postId, user_id: userId }]);
        if (error) throw error;
      }

      await fetchLikes();
      if (onRefresh) onRefresh(); // ✅ Trigger parent to update
    } catch (err) {
      console.error('❌ Like/unlike failed:', err.message);
    }

    setLoading(false);
  };

  const toggleComments = () => setShowComments((prev) => !prev);
  const handleShare = () => setShowShareOptions((prev) => !prev);

  const postLink = `${window.location.origin}/post/${postId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postLink);
    alert('🔗 Post link copied!');
    setShowShareOptions(false);
  };

  return (
    <>
      <div className="interaction-bar">
        {likesCount > 0 && (
          <div className="like-count-display">
            <FaThumbsUp className="blue-icon" />
            <span>{likesCount}</span>
          </div>
        )}

        <hr className="separator" />

        <div className="post-actions">
          <button
            className={`action-button ${hasLiked ? 'liked' : ''}`}
            onClick={toggleLike}
            disabled={loading}
          >
            <FaThumbsUp /> {hasLiked ? 'Liked' : 'Like'}
          </button>

          <button className="action-button" onClick={toggleComments}>
            <FaComment /> Comment
          </button>

          <button className="action-button" onClick={handleShare}>
            <FaShare /> Share
          </button>
        </div>

        {showShareOptions && (
          <div className="share-options">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(postLink)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📱 WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📘 Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postLink)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🐦 Twitter
            </a>
            <button onClick={handleCopyLink}>🔗 Copy Link</button>
          </div>
        )}
      </div>

      {showComments && (
        <CommentModal
          postId={postId}
          userId={userId}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
}
