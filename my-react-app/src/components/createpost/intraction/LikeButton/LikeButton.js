// src/components/LikeButton.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../supabaseClient';
import { useUser } from '../../../../context/UserContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
const LikeButton = ({ postId, postOwnerId }) => {
  const { userData } = useUser();
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);

  useEffect(() => {
    if (userData) checkLike();
  }, [userData]);

  const checkLike = async () => {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userData.id)
      .single();

    if (data) {
      setLiked(true);
      setLikeId(data.id);
    } else {
      setLiked(false);
      setLikeId(null);
    }
  };

  const handleLike = async () => {
    if (!userData) return;

    if (liked) {
      await supabase.from('likes').delete().eq('id', likeId);
      setLiked(false);
      setLikeId(null);

      await supabase
        .from('like_notifications')
        .delete()
        .eq('sender_id', userData.id)
        .eq('receiver_id', postOwnerId)
        .eq('post_id', postId)
        .eq('type', 'like');
    } else {
      const { data } = await supabase
        .from('likes')
        .insert([{ post_id: postId, user_id: userData.id }])
        .select()
        .single();

      if (data) {
        setLiked(true);
        setLikeId(data.id);

        if (userData.id !== postOwnerId) {
          await supabase.from('like_notifications').insert({
            sender_id: userData.id,
            receiver_id: postOwnerId,
            post_id: postId,
            type: 'like',
            created_at: new Date().toISOString(),
          });
        }
      }
    }
  };

  return (
    
    <button onClick={handleLike}>
      {liked ? <FaHeart color="red" /> : <FaRegHeart />}
    </button>
    
  );
};

export default LikeButton;
