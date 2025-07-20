import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useUser } from '../../context/UserContext';
import './NotificationList.css';

export default function NotificationList({ setNotificationCount }) {
  const { userData } = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          type,
          created_at,
          read,
          sender_id,
          profiles:profiles!notifications_sender_id_fkey(full_name, avatar_url)
        `)
        .eq('receiver_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data);
        setNotificationCount(data.length); // Update count in Navbar
      }
    };

    if (userData?.id) fetchNotifications();
  }, [userData, setNotificationCount]);

  const handleClearAll = async () => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('receiver_id', userData.id);

    if (error) console.error('Error clearing notifications:', error);
    else {
      setNotifications([]);
      setNotificationCount(0); // Reset count in Navbar
    }
  };

  return (
    <div className="notifications-container">
      <div className="notif-header">
        <h2>Notifications</h2>
        <button className="clear-btn" onClick={handleClearAll}>
          Clear All
        </button>
      </div>
      {notifications.map((notif) => (
        <div key={notif.id} className="notification-card">
          <img src={notif.profiles?.avatar_url || '/default-avatar.png'} alt="Avatar" />
          <span>
            <strong>{notif.profiles?.full_name}</strong>{' '}
            {notif.type === 'follow' ? 'followed you' : 'unfollowed you'}
          </span>
          <small>
            {new Date(notif.created_at).toLocaleString('en-PK', {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: 'Asia/Karachi'
            })}
          </small>
        </div>
      ))}
    </div>
  );
}
