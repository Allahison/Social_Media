import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useUser } from '../../context/UserContext';

export default function FollowButton({ targetUserId }) {
  const { userData } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkFollowing = async () => {
    const { data } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', userData.id)
      .eq('following_id', targetUserId);

    setIsFollowing(data.length > 0);
    setLoading(false);
  };

  const toggleFollow = async () => {
    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', userData.id)
        .eq('following_id', targetUserId);

      // Add "unfollow" notification
      await supabase.from('notifications').insert([
        {
          type: 'unfollow',
          sender_id: userData.id,
          receiver_id: targetUserId,
        },
      ]);
    } else {
      await supabase
        .from('follows')
        .insert([{ follower_id: userData.id, following_id: targetUserId }]);

      // Add "follow" notification
      await supabase.from('notifications').insert([
        {
          type: 'follow',
          sender_id: userData.id,
          receiver_id: targetUserId,
        },
      ]);
    }

    checkFollowing();
  };

  useEffect(() => {
    if (userData?.id && targetUserId) checkFollowing();
  }, [userData, targetUserId]);

  if (loading || userData?.id === targetUserId) return null;

  return (
    <button onClick={toggleFollow} className="follow-btn">
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
