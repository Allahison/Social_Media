// src/components/Notifications/NotificationList.jsx
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
              profiles:profiles!notifications_sender_id_fkey(full_name, avatar_url)
            `)
            .eq('receiver_id', userData.id),

          supabase
            .from('like_notifications')
            .select(`
              id,
              post_id,
              created_at,
              sender_id,
              profiles:sender_id(full_name, avatar_url)
            `)
            .eq('receiver_id', userData.id),

          supabase
            .from('comment_notifications')
            .select(`
              id,
              post_id,
              created_at,
              sender_id,
              profiles:sender_id(full_name, avatar_url)
            `)
            .eq('receiver_id', userData.id)
        ]);

        if (followError || likeError || commentError) {
          console.error('Notification fetch error:', followError || likeError || commentError);
          return;
        }

        const formattedFollow = (followData || []).map((item) => ({
          id: item.id,
          type: item.type,
          created_at: new Date(item.created_at),
          sender: item.profiles
        }));

        const formattedLikes = (likeData || []).map((item) => ({
          id: item.id,
          type: 'like',
          created_at: new Date(item.created_at),
          sender: item.profiles
        }));

        const formattedComments = (commentData || []).map((item) => ({
          id: item.id,
          type: 'comment',
          created_at: new Date(item.created_at),
          sender: item.profiles
        }));

        const all = [...formattedFollow, ...formattedLikes, ...formattedComments].sort(
          (a, b) => b.created_at - a.created_at
        );

        setNotifications(all);
        if (setNotificationCount) setNotificationCount(all.length);
      } catch (err) {
        console.error('Unexpected error fetching notifications:', err);
      }
    };

    fetchAllNotifications();
  }, [userData, setNotificationCount]);

  const handleClearAll = async () => {
    try {
      const [followResult, likeResult, commentResult] = await Promise.all([
        supabase.from('notifications').delete().eq('receiver_id', userData.id),
        supabase.from('like_notifications').delete().eq('receiver_id', userData.id),
        supabase.from('comment_notifications').delete().eq('receiver_id', userData.id)
      ]);

      if (followResult.error || likeResult.error || commentResult.error) {
        console.error('Clear error:', followResult.error || likeResult.error || commentResult.error);
        return;
      }

      setNotifications([]);
      if (setNotificationCount) setNotificationCount(0);
    } catch (err) {
      console.error('Unexpected error clearing notifications:', err);
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

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((notif) => (
          <div key={notif.id} className="notification-card">
            <img
              src={notif.sender?.avatar_url || '/default-avatar.png'}
              alt="Avatar"
              className="avatar"
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
                : ''}
              <br />
              <small>
                {notif.created_at.toLocaleString('en-PK', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                  timeZone: 'Asia/Karachi'
                })}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
