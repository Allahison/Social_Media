import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import './PostFeed.css';
import InteractionBar from '../createpost/intraction/InteractionBar';
import { motion, AnimatePresence } from 'framer-motion';
import FollowButton from '../Follow/FollowButton';
import PostFeedLoader from './PostFeedLoader';
import Loader from '../Loader';

export default function PostFeed() {
  const { userData } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        user_id,
        content,
        media_url,
        media_type,
        created_at,
        username,
        avatar_url
      `)
      .eq('category', 'media') // ✅ only media category posts
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching posts:', error.message);
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .match({ id: postId, user_id: userData?.id });

    if (error) {
      alert('❌ Failed to delete post: ' + error.message);
    } else {
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diff = Math.floor((now - posted) / 1000);
    if (diff < 60) return `${diff} second${diff !== 1 ? 's' : ''} ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) !== 1 ? 's' : ''} ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) !== 1 ? 's' : ''} ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) !== 1 ? 's' : ''} ago`;
    return posted.toLocaleDateString();
  };

  if (!userData) return <Loader />;

  return (
    <div className="post-feed-container">
      {loading ? (
        <PostFeedLoader />
      ) : posts.length === 0 ? (
        <p>No media posts available.</p>
      ) : (
        <AnimatePresence>
          {posts.map((post) => {
            const avatar = post.avatar_url?.trim() || '/assets/photo/1.jpg';
            const name = post.username?.trim() || 'Anonymous';
            const timeAgo = formatTimeAgo(post.created_at);

            return (
              <motion.div
                key={post.id}
                className="post-card"
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.3 }}
              >
                {/* Post Header */}
                <div className="post-header">
                  <div className="post-header-left">
                    <Link to={`/user/${post.user_id}`}>
                      <img src={avatar} alt="User Avatar" className="post-avatar" />
                    </Link>
                    <div className="post-user-info">
                      <Link to={`/user/${post.user_id}`} className="post-username-link">
                        <span className="post-username">{name}</span>
                      </Link>
                      <span className="post-time">{timeAgo}</span>
                    </div>
                  </div>

                  {userData.id === post.user_id && (
                    <div
                      className="delete-icon"
                      title="Delete Post"
                      onClick={() => handleDelete(post.id)}
                      style={{ cursor: 'pointer', fontSize: '18px', color: '#e74c3c' }}
                    >
                      🗑️
                    </div>
                  )}
                </div>

                {/* Follow Button (if not current user's post) */}
                {userData.id !== post.user_id && (
                  <div className="follow-button-wrapper">
                    <FollowButton targetUserId={post.user_id} />
                  </div>
                )}

                {/* Post Content */}
                {post.content && <p className="post-content">{post.content}</p>}

                {/* Media */}
                {post.media_url && (
                  post.media_url.endsWith('.mp4') ? (
                    <video className="post-media" controls>
                      <source src={post.media_url} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={post.media_url} alt="Post Media" className="post-media" />
                  )
                )}

                <InteractionBar
                  postId={post.id}
                  userId={userData.id}
                  likesCount={post.likes_count || 0}
                  hasLiked={post.has_liked || false}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
