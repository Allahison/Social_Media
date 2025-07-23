// src/components/PostCard.js
import React from 'react';
import './PostCard.css';
import InteractionBar from '../createpost/intraction/InteractionBar';

export default function PostCard({ post, currentUserId, onDelete }) {
  if (!post) return null;

  const {
    username,
    avatar_url,
    created_at,
    content,
    media_url,
    media_type,
    user_id,
    id,
  } = post;

  const profileImage = avatar_url || '/assets/default-avatar.png';
  const displayName = username || 'User';
  const date = created_at
    ? new Date(created_at).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={profileImage}
          alt="Avatar"
          className="post-avatar"
        />
        <div className="post-user-info">
          <h4>{displayName}</h4>
          <p className="timestamp">{date}</p>
        </div>
      
    
      </div>

      {content && <p className="post-content">{content}</p>}

      {media_url && (
        <div className="post-media">
          {media_type === 'image' && (
            <img src={media_url} alt="Post" className="post-image" />
          )}
          {media_type === 'video' && (
            <video controls className="post-video">
              <source src={media_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      {/* ✅ Updated InteractionBar to also accept post to manage local like state */}
      <InteractionBar key={post.id} postId={id} userId={currentUserId} />

    </div>
  );
}
