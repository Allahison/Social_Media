import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';
import CreatePost from '../components/createpost/CreatePost';
import PostFeed from '../components/createpost/PostFeed';
import Navbar from '../components/Navbar/Navbar';
import Loader from '../components/Loader';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData === undefined) return;
    if (userData === null) {
      navigate('/login');
    } else {
      fetchProfile(userData.id);
    }
  }, [userData]);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Error fetching profile:', error.message);
    } else {
      setProfile(data);
    }

    setLoading(false);
  };

  if (userData === undefined || loading) {
    return <Loader />;
  }

  const avatarUrl = profile?.avatar_url?.trim() || '/assets/default-avatar.png';
  const coverUrl = profile?.cover_url?.trim() || '/assets/cover-photo.jpg';
  const fullName = profile?.full_name || userData.email;
  const description = profile?.description || '';

  return (
    <>
      <Helmet><title>Dashboard</title></Helmet>
      <div className="dashboard-wrapper">
        <Navbar user={userData} />
        <div className="dashboard-layout">
          {/* Left Sidebar */}
          <aside className="sidebar-left">
            <Link to={`/profile/${userData.id}`} className="profile-summary-card">
              <img src={coverUrl} alt="Cover" className="profile-cover" />
              <div className="avatar-box">
                <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
              </div>
              <div className="profile-info">
                <p className="profile-name">{fullName}</p>
                {description && <p className="profile-tagline">{description}</p>}
              </div>
            </Link>
          </aside>

          {/* Main Content */}
          <main className="feed-area">
            <CreatePost user={userData} />
            <PostFeed user={userData} />
          </main>

          {/* Right Sidebar */}
          <aside className="sidebar-right">
            <div className="connections-widget">
              <h3>Connections</h3>
              <div className="connection-list">
                {['Ahmed Khan', 'Ahsan', 'Saboor'].map((name, i) => (
                  <div className="connection-item" key={i}>
                    <div className="connection-avatar">
                      <img src={`/assets/photos/${i + 1}.jpg`} alt={name} />
                    </div>
                    <span className="connection-name">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}