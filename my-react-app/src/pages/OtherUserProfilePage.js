import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar/Navbar';
import InteractionBar from '../components/createpost/intraction/InteractionBar';
import FollowButton from '../components/Follow/FollowButton';
import { useUser } from '../context/UserContext';
import './OtherUserProfilePage.css';

export default function OtherUserProfilePage() {
  const { id } = useParams();
  const { userData } = useUser();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileAndPosts();
  }, [id]);

  const fetchProfileAndPosts = async () => {
    setLoading(true);

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
    } else {
      setProfile(profileData);
    }

    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (full_name, avatar_url)
      `)
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts:', postsError.message);
    } else {
      setPosts(postsData);
    }

    const { count: followers, error: followersError } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', id);

    if (!followersError) setFollowersCount(followers);

    const { count: following, error: followingError } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', id);

    if (!followingError) setFollowingCount(following);

    setLoading(false);
  };

  if (loading) return <div className="other-profile-loading">Loading profile...</div>;
  if (!profile) return <div className="other-profile-error">❌ User not found</div>;

  return (
    <div className="other-profile-container">
      <Navbar />

      <div className="other-profile-cover">
        <img src={profile.cover_url || '/cover-photo.jpg'} alt="Cover" />
      </div>

      <div className="other-profile-header">
        <div className="other-profile-avatar">
          <img
            src={profile.avatar_url || '/default-avatar.png'}
            alt="User Avatar"
          />
        </div>
        <div className="other-profile-info">
          <h2>{profile.full_name || 'Unnamed User'}</h2>
          <p className="other-profile-description">
            {profile.description || 'No description available.'}
          </p>
          <p className="other-profile-post-count">
            📄 {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
          </p>
          <div className="other-follow-stats">
            <span>👥 {followersCount} Followers</span>
            <span>➡️ {followingCount} Following</span>
          </div>
        </div>
      </div>

      {userData?.id !== profile.id && (
        <div className="other-follow-button-wrapper">
          <FollowButton currentUserId={userData?.id} targetUserId={profile.id} />
        </div>
      )}

      <div className="other-profile-posts">
        <h3>{profile.full_name?.split(' ')[0]}'s Posts</h3>

        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div className="post-card" key={post.id}>
              <div className="post-header">
                <img
                  src={post.profiles?.avatar_url || '/default-avatar.png'}
                  alt="Avatar"
                  className="post-avatar"
                />
                <div className="post-user-info">
                  <h4>{post.profiles?.full_name || 'Unknown User'}</h4>
                  <p className="post-date">
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="post-text">{post.content}</p>

              {post.media_url &&
                (post.media_url.endsWith('.mp4') ? (
                  <video className="post-media" controls>
                    <source src={post.media_url} type="video/mp4" />
                  </video>
                ) : (
                  <img src={post.media_url} alt="Post" className="post-media" />
                ))}

              <InteractionBar postId={post.id} userId={post.user_id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
