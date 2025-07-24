// src/components/Notifications/CommentNotification.jsx
/*import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../supabaseClient';
import { useUser } from '../../../../context/UserContext';
import { Link } from 'react-router-dom';

const CommentNotification = () => {
  const { userData } = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userData?.id) {
      fetchNotifications();
    }
  }, [userData]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('comment_notifications')
      .select(`
        *,
        profiles:sender_id (
          full_name,
          avatar_url
        )
      `)
      .eq('receiver_id', userData.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setNotifications(data);
    }
  };

  return (
    <div className="notification-dropdown">
      {notifications.length === 0 ? (
        <p className="no-notifications">No new notifications</p>
      ) : (
        notifications.map((notif) => (
          <Link to={`/post/${notif.post_id}`} key={notif.id} className="notification-item">
            <img
              src={notif.profiles?.avatar_url || '/default-avatar.png'}
              alt="Avatar"
              className="notification-avatar"
            />
            <span className="notification-text">
              <strong>{notif.profiles?.full_name}</strong> commented on your post
            </span>
          </Link>
        ))
      )}
    </div>
  );
};

export default CommentNotification;
*/