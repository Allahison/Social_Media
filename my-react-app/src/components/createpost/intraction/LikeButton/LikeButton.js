// src/components/LikeButton.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../context/UserContext';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import './LikeButton.css';

const LikeButton = ({ postId, onLike }) => {
  const { userData } = useUser();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const userId = userData?.id;

  const fetchLikeData = async () => {
    if (!userId) return;

    const { data: like } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    setLiked(!!like);

    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    setLikeCount(count || 0);
  };

  const toggleLike = async () => {
    if (!userId) return;

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
    } else {
      await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: userId });
    }

    fetchLikeData(); // Local refresh
    if (onLike) onLike(); // 🔁 Notify parent (to refresh posts if needed)
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
