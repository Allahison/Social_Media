import React, { useState, useEffect } from 'react';
import './UserProfilePage.css';
import { useUser } from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import PostCard from '../components/PostCard/PostCard';
import { useFollow } from '../context/FollowContext';
import Navbar from '../components/Navbar/Navbar';
import Loader from '../components/Loader';

export default function UserProfilePage() {
  const { userData } = useUser();
  const { followersList, followingList, fetchFollowers, fetchFollowing } = useFollow();
  const { id: viewedUserId } = useParams(); // 👈 friend/user profile ID from URL

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followType, setFollowType] = useState('');
  const [followUsersData, setFollowUsersData] = useState([]);

  const isOwnProfile = userData?.id === viewedUserId;

  useEffect(() => {
    if (!viewedUserId) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', viewedUserId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error.message);
      } else {
        setProfileData(data);
        fetchFollowers(viewedUserId);
        fetchFollowing(viewedUserId);
        fetchUserPosts(viewedUserId);
      }
    };

    fetchProfile();
  }, [viewedUserId]);

  useEffect(() => {
    if (
      showFollowModal &&
      ((followType === 'followers' && followersList.length > 0) ||
        (followType === 'following' && followingList.length > 0))
    ) {
      fetchFollowUsersDetails();
    }
  }, [showFollowModal, followType, followersList, followingList]);

  const fetchUserPosts = async (userId) => {
    try {
      setLoadingPosts(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching user posts:', error.message);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userData.id);

      if (error) {
        alert('Failed to delete post.');
        console.error('Delete error:', error);
      } else {
        alert('Post deleted successfully!');
        fetchUserPosts(viewedUserId);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const fetchFollowUsersDetails = async () => {
    const rawList = followType === 'followers' ? followersList : followingList;
    const userIds = rawList
      .map(item => followType === 'followers' ? item.follower_id : item.following_id)
      .filter(Boolean);

    if (userIds.length === 0) {
      setFollowUsersData([]);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, username')
      .in('id', userIds);

    if (error) {
      console.error('❌ Error fetching follow users:', error.message);
    } else {
      setFollowUsersData(data || []);
    }
  };

  if (!profileData) return <Loader />;

  return (
    <div className="user-profile-page">
      <Navbar />

      {profileData.cover_url && (
        <div className="cover-photo-wrapper">
          <img
            src={profileData.cover_url}
            alt="Cover"
            className="cover-photo"
          />
        </div>
      )}

      <div className="profile-card">
        <img
          src={profileData.avatar_url || '/assets/default-avatar.png'}
          alt="Profile"
          className="profile-avatar"
        />
        <h2>@{profileData.username || 'user'}</h2>
        <div className="full-name-text">🧑 {profileData.full_name}</div>
        <div className="description-text">📜 {profileData.description}</div>
        <div className="dob-text">🎂 Date of Birth: {profileData.dob}</div>

        <div className="follow-stats">
          <div onClick={() => { setFollowType('followers'); setShowFollowModal(true); }}>
            👥 Followers: {followersList.length}
          </div>
          <div onClick={() => { setFollowType('following'); setShowFollowModal(true); }}>
            ➕ Following: {followingList.length}
          </div>
        </div>
      </div>

      <div className="user-posts">
        <h3 className="posts-heading">{isOwnProfile ? 'Your Posts' : `${profileData.full_name}'s Posts`}</h3>
        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="user-post-wrapper">
              <PostCard
                post={post}
                currentUserId={userData.id}
                onDelete={fetchUserPosts}
              />
              {isOwnProfile && (
                <button
                  className="delete-post-btn"
                  onClick={() => handleDeletePost(post.id)}
                >
                  🗑 Delete Post
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {showFollowModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{followType === 'followers' ? 'Followers' : 'Following'}</h3>
            {followUsersData.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <ul className="follow-user-list">
                {followUsersData.map((user) => (
                  <li key={user.id} className="follow-user-item">
                    <img
                      src={user.avatar_url || '/assets/default-avatar.png'}
                      alt="Avatar"
                      className="follow-user-avatar"
                    />
                    <div className="follow-user-info">
                      <div className="follow-user-name">{user.full_name}</div>
                      <div className="follow-user-username">@{user.username || 'user'}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowFollowModal(false)} className="close-modal-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
