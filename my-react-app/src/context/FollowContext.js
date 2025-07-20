// src/context/FollowContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from './UserContext';

const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const { userData } = useUser();
  const [followingList, setFollowingList] = useState([]);
  const [followersList, setFollowersList] = useState([]);

  const fetchFollowing = async (userId) => {
    const { data, error } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);
    if (!error) setFollowingList(data.map(f => f.following_id));
  };

  const fetchFollowers = async (userId) => {
    const { data, error } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', userId);
    if (!error) setFollowersList(data.map(f => f.follower_id));
  };

  // Real-time subscription to notify user when someone follows them
  useEffect(() => {
    if (!userData) return;
    const channel = supabase
      .channel('realtime-follows')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'follows' },
        (payload) => {
          const newFollow = payload.new;
          if (newFollow.following_id === userData?.id) {
            alert('🎉 You have a new follower!');
            fetchFollowers(userData.id); // Update followers in real-time
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userData]);

  return (
    <FollowContext.Provider
      value={{
        followingList,
        followersList,
        fetchFollowing,
        fetchFollowers,
      }}
    >
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => useContext(FollowContext);
