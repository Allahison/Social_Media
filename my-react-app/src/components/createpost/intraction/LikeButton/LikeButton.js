// src/components/LikeButton.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import './LikeButton.css'; // optional for custom styling

const LikeButton = ({ postId }) => {
  const { userData } = useUser();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const userId = userData?.id;

  // ✅ Fetch if user has liked the post + total likes
  const fetchLikeData = async () => {
    if (!userId) return;

    const { data: like, error: likeError } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    setLiked(!!like);

    const { count, error: countError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    if (!countError) {
      setLikeCount(count);
    }
  };

  // ✅ Like or unlike the post
  const toggleLike = async () => {
    if (!userId) return;

    if (liked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: userId });
    }

    fetchLikeData(); // refresh like state
  };

  useEffect(() => {
    fetchLikeData();
  }, [postId, userId]);

  return (
    <div className="like-button" onClick={toggleLike}>
      {liked ? (
        <AiFillHeart size={22} color="red" />
      ) : (
        <AiOutlineHeart size={22} />
      )}
      <span>{likeCount}</span>
    </div>
  );
};

export default LikeButton;
