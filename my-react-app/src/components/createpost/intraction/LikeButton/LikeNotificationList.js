/*import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../supabaseClient';
import { useUser } from '../../../../context/UserContext';

export default function LikeNotificationList() {
  const { userData } = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userData) {
      fetchNotifications();
    }
  }, [userData]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('like_notifications')
      .select(`
        id,
        post_id,
        created_at,
        sender_id,
        profiles:sender_id(full_name, avatar_url)
      `)
      .eq('receiver_id', userData.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setNotifications(data);
    } else {
      console.error('Error fetching notifications:', error.message);
    }
  };

  return (
    <div className="notification-list">
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id} className="notification-card">
            <img
              src={notification.profiles?.avatar_url || '/default-avatar.png'}
              alt="Avatar"
              className="avatar"
            />
            <div className="notification-text">
              <strong>{notification.profiles?.full_name}</strong> liked your post.
            </div>
          </div>
        ))
      )}
    </div>
  );
}
*/