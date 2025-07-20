import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function FollowersModal({ userId, onClose }) {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const { data, error } = await supabase
        .from('follows')
        .select('follower_id, profiles!follower_id(*)')
        .eq('following_id', userId);
      if (!error) setFollowers(data);
    };
    fetchFollowers();
  }, [userId]);

  return (
    <div className="modal">
      <h3>Followers</h3>
      <ul>
        {followers.map(({ profiles }) => (
          <li key={profiles.id}>{profiles.full_name}</li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
