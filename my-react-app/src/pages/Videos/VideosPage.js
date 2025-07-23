// src/pages/VideosPage.jsx
import React, { useEffect, useState } from 'react';
import './VideosPage.css';
import Navbar from '../../components/Navbar/Navbar';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../supabaseClient';
import InteractionBar from '../../components/createpost/intraction/InteractionBar';
import {
  FaHome,
  FaGamepad,
  FaVideo,
  FaSave,
  FaBroadcastTower
} from 'react-icons/fa';

export default function VideosPage({ user }) {
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [savedVideos, setSavedVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        media_url,
        media_type,
        created_at,
        user_id,
        profile: user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('media_type', 'video')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
    } else {
      setVideos(data);
    }
  };

  const toggleSave = (video) => {
    const isSaved = savedVideos.some(v => v.id === video.id);
    if (isSaved) {
      setSavedVideos(savedVideos.filter(v => v.id !== video.id));
    } else {
      setSavedVideos([...savedVideos, video]);
    }
  };

  const filteredVideos = () => {
    let filtered = [];

    switch (activeTab) {
      case 'reels':
        filtered = videos;
        break;
      case 'gaming':
        filtered = videos.filter(video =>
          video.content?.toLowerCase().includes('game')
        );
        break;
      case 'saved':
        filtered = savedVideos;
        break;
      case 'home':
      default:
        filtered = videos;
    }

    if (activeTab === 'home' && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(video =>
        video.content?.toLowerCase().includes(query) ||
        video.profile?.full_name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  return (
    <>
      <Helmet>
        <title>Watch Videos</title>
      </Helmet>

      <Navbar user={user} />

      <main className="videos-page">
        <aside className="videos-sidebar">
          {activeTab === 'home' && (
            <div className="search-bar-wrapper sidebar-search">
              <input
                type="text"
                placeholder="🔍 Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          )}

          <h3>Explore</h3>
          <ul>
            <li onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active-tab' : ''}>
              <FaHome /> Home
            </li>
            <li onClick={() => setActiveTab('live')} className={activeTab === 'live' ? 'active-tab' : ''}>
              <FaBroadcastTower /> Live
            </li>
            <li onClick={() => setActiveTab('reels')} className={activeTab === 'reels' ? 'active-tab' : ''}>
              <FaVideo /> Reels
            </li>
            <li onClick={() => setActiveTab('gaming')} className={activeTab === 'gaming' ? 'active-tab' : ''}>
              <FaGamepad /> Gaming
            </li>
            <li onClick={() => setActiveTab('saved')} className={activeTab === 'saved' ? 'active-tab' : ''}>
              <FaSave /> Saved
            </li>
          </ul>
        </aside>

        <section className="videos-content">
          <h2>
            {activeTab === 'home' && '🎥 Recommended Videos'}
            {activeTab === 'live' && '🔴 Live - Coming Soon'}
            {activeTab === 'reels' && '🎬 Reels'}
            {activeTab === 'gaming' && '🎮 Gaming Videos'}
            {activeTab === 'saved' && '⭐ Saved Videos'}
          </h2>

          {activeTab === 'live' ? (
            <div className="coming-soon-box">
              <p>🚧 Live streaming feature is under development. Stay tuned!</p>
            </div>
          ) : (
            <div className="video-grid">
              {filteredVideos().length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>No videos found.</p>
              ) : (
                filteredVideos().map((video) => (
                  <div key={video.id} className="video-card">
                    <div className="video-user-info">
                      <img
                        src={video.profile?.avatar_url || '/assets/photos/default-user.png'}
                        alt="User"
                        className="video-user-avatar"
                      />
                      <div className="video-user-meta">
                        <strong>{video.profile?.full_name || 'Unknown User'}</strong>
                        <small>
                          {new Date(video.created_at).toLocaleDateString()}{' '}
                          {new Date(video.created_at).toLocaleTimeString()}
                        </small>
                      </div>
                    </div>

                    <video
                      className="video-thumb"
                      controls
                      poster={video.media_url?.replace('.mp4', '.jpg')}
                      src={video.media_url}
                    />

                    <div className="video-info">
                      <p>{video.content}</p>
                      <button
                        className={`save-btn ${savedVideos.some(v => v.id === video.id) ? 'saved' : ''}`}
                        onClick={() => toggleSave(video)}
                      >
                        ⭐ {savedVideos.some(v => v.id === video.id) ? 'Saved' : 'Save'}
                      </button>
                      <InteractionBar
                        postId={video.id}
                        userId={video.user_id}
                        type="video"
                        loggedInUserId={user?.id}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'home' && (
            <section className="courses-section">
              <h2>🚀 Learn Full Stack Development</h2>
              <div className="courses-grid">
                {[
                  {
                    title: "MERN Stack Full Course",
                    tech: "MongoDB • Express • React • Node.js",
                    url: "https://www.youtube.com/watch?v=4Z9KEBexzcM",
                    img: "/assets/photos/1.jpg",
                  },
                  {
                    title: "Full Stack with Django & React",
                    tech: "React • Django • PostgreSQL",
                    url: "https://www.youtube.com/watch?v=PTZiDnuC86g",
                    img: "/assets/photos/3.jpg",
                  },
                  {
                    title: "Full Stack JavaScript Course",
                    tech: "HTML • CSS • JS • Node.js",
                    url: "https://www.youtube.com/watch?v=ENrzD9HAZK4",
                    img: "/assets/photos/4.jpg",
                  },
                  {
                    title: "Next.js & Firebase Full Guide",
                    tech: "Next.js • Firebase • Tailwind CSS",
                    url: "https://www.youtube.com/watch?v=R4fhU4lVb-U",
                    img: "/assets/photos/5.jpg",
                  }
                ].map((course, i) => (
                  <div className="course-card" key={i}>
                    <img src={course.img} alt={course.title} className="course-thumbnail" />
                    <div className="course-info">
                      <h4>{course.title}</h4>
                      <p>{course.tech}</p>
                      <a href={course.url} target="_blank" rel="noreferrer" className="course-btn">
                        🔗 Watch Course
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>
      </main>
    </>
  );
}  