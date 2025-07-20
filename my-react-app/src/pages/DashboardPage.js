import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabaseClient';
import CreatePost from '../components/createpost/CreatePost';
import PostFeed from '../components/createpost/PostFeed';
import Navbar from '../components/Navbar/Navbar';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { userData } = useUser(); // This gives you { id, email }
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (userData === undefined) return; // still loading
    if (userData === null) {
      navigate('/login');
    } else {
      fetchProfile(userData.id);
    }
  }, [userData]);

  // ✅ Fetch profile info from Supabase using user ID
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
    return <div className="loader">Loading...</div>;
  }

  const avatarUrl = profile?.avatar_url?.trim() || '/assets/default-avatar.png';
  const coverUrl = profile?.cover_url?.trim() || '/assets/cover-photo.jpg';
  const fullName = profile?.full_name || userData.email;
  const description = profile?.description || '';

  return (
    <>
      <Helmet><title>Dashboard</title></Helmet>

      <div className="dashboard-container">
        <Navbar user={userData} />

        <div className="dashboard-main">
          {/* ✅ Left Sidebar */}
          <div className="sidebar-profile">
            <Link to={`/profile/${userData.id}`} className="profile-card">
              <img src={coverUrl} alt="Cover" className="cover-photo" />
              <div className="avatar-wrapper-enhanced">
                <img src={avatarUrl} alt="Avatar" className="avatar-enhanced" />
              </div>
              <div className="user-info">
                <p className="username">{fullName}</p>
                {description && <p className="headline">{description}</p>}
              </div>
            </Link>
          </div>

          {/* ✅ Main Content */}
          <div className="dashboard-content">
            <CreatePost user={userData} />
            <PostFeed user={userData} />
          </div>

          {/* ✅ Right Sidebar */}
          <div className="sidebar-right">
            <div className="right-card">
              <h3>Contacts</h3>
              <div className="contacts-section">
                {['Ahmed Khan', 'Ahsan', 'Saboor'].map((name, i) => (
                  <div className="contact-item" key={i}>
                    <div className="contact-avatar">
                      <img src={`/assets/photos/${i + 1}.jpg`} alt={name} />
                    </div>
                    <span className="contact-name">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
