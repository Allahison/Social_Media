import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useUser } from '../../context/UserContext';
import './NotificationList.css';

export default function NotificationList({ setNotificationCount }) {
  const { userData } = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      if (!userData?.id) return;

      try {
        const [
          { data: followData, error: followError },
          { data: likeData, error: likeError },
          { data: commentData, error: commentError }
        ] = await Promise.all([
          supabase
            .from('notifications')
            .select(`
              id,
              type,
              created_at,
              sender_id,
              profiles!fk_notification_sender (
                full_name,
                avatar_url
              )
            `)
            .eq('receiver_id', userData.id),

          supabase
            .from('like_notifications')
            .select(`
              id,
              type,
              created_at,
              sender_id,
              post_id,
              profiles!fk_like_sender (
                full_name,
                avatar_url
              )
            `)
            .eq('receiver_id', userData.id),

          supabase
            .from('comment_notifications')
            .select(`
              id,
              type,
              created_at,
              sender_id,
              post_id,
              comment_id,
              profiles!fk_comment_sender (
                full_name,
                avatar_url
              )
            `)
            .eq('receiver_id', userData.id)
        ]);

        if (followError || likeError || commentError) {
          console.error('Error fetching notifications:', followError || likeError || commentError);
          return;
        }

        const formatData = (data, fallbackType = null) =>
          (data || []).map((item) => ({
            id: item.id,
            type: item.type || fallbackType,
            created_at: new Date(item.created_at),
            sender: item.profiles
          }));

        const allNotifications = [
          ...formatData(followData),
          ...formatData(likeData, 'like'),
          ...formatData(commentData, 'comment')
        ].sort((a, b) => b.created_at - a.created_at);

        setNotifications(allNotifications);
        if (setNotificationCount) setNotificationCount(allNotifications.length);
      } catch (error) {
        console.error('Unexpected error fetching notifications:', error);
      }
    };

    fetchAllNotifications();
  }, [userData, setNotificationCount]);

  const handleClearAll = async () => {
    if (!userData?.id) return;

    try {
      const [followDel, likeDel, commentDel] = await Promise.all([
        supabase.from('notifications').delete().eq('receiver_id', userData.id),
        supabase.from('like_notifications').delete().eq('receiver_id', userData.id),
        supabase.from('comment_notifications').delete().eq('receiver_id', userData.id)
      ]);

      if (followDel.error || likeDel.error || commentDel.error) {
        console.error('Clear error:', followDel.error || likeDel.error || commentDel.error);
        return;
      }

      setNotifications([]);
      if (setNotificationCount) setNotificationCount(0);
    } catch (error) {
      console.error('Unexpected error clearing notifications:', error);
    }
  };

  return (
    <div className="notification-list-wrapper">
      <div className="notification-header">
        <span>Notifications</span>
        <button className="notification-clear-btn" onClick={handleClearAll}>
          Clear
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="no-notification">No notifications</p>
      ) : (
        <div className="notification-scroll">
          {notifications.map((notif) => (
            <div key={notif.id} className="notification-card">
              <img
                src={notif.sender?.avatar_url || '/assets/default-avatar.png'}
                alt="Avatar"
                className="notification-avatar"
              />
              <div className="notification-text">
                <strong>{notif.sender?.full_name}</strong>{' '}
                {notif.type === 'like'
                  ? 'liked your post.'
                  : notif.type === 'follow'
                  ? 'followed you.'
                  : notif.type === 'unfollow'
                  ? 'unfollowed you.'
                  : notif.type === 'comment'
                  ? 'commented on your post.'
                  : 'performed an action.'}
                <br />
                <small className="notification-time">
                  {notif.created_at.toLocaleString('en-PK', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'Asia/Karachi'
                  })}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
