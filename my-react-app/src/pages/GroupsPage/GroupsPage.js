import React, { useEffect, useState } from 'react';
import './GroupsPage.css';
import Navbar from '../../components/Navbar/Navbar';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../supabaseClient';
import { useUser } from '../../context/UserContext';
import PostFeedLoader from '../../components/createpost/PostFeedLoader';
import { Link } from 'react-router-dom';

export default function GroupsPage() {
  const { userData } = useUser();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.id) fetchFriends();
  }, [userData]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const { data: following } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userData.id);

      const { data: followers } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', userData.id);

      const followingIds = following?.map(f => f.following_id) || [];
      const followerIds = followers?.map(f => f.follower_id) || [];

      const mutualIds = followingIds.filter(id => followerIds.includes(id));

      const { data: mutualProfiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, description')
        .in('id', mutualIds);

      setFriends(mutualProfiles || []);
    } catch (err) {
      console.error('Error fetching friends:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Friends | InterviewPrep</title>
      </Helmet>
      <Navbar />
      <div className="groups-page">
        <main className="groups-content">
          <h2 className="section-title">Your Friends</h2>

          {loading ? (
            <PostFeedLoader />
          ) : friends.length === 0 ? (
            <p className="no-friends">You have no friends yet. Start connecting!</p>
          ) : (
            <div className="friend-grid">
              {friends.map(friend => (
                <div key={friend.id} className="friend-card">
                  <img
                    src={friend.avatar_url || '/assets/default-avatar.png'}
                    alt={friend.full_name}
                    className="friend-avatar"
                  />
                  <div className="friend-info">
                    <h3>{friend.full_name}</h3>
                    <p>{friend.description || 'No bio yet.'}</p>
                    <Link to={`/profile/${friend.id}`}>
                      <button className="friend-btn">View Profile</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
