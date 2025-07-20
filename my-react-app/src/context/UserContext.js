// src/context/UserContext.js
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(undefined); // undefined = loading
  const [refreshPostsFlag, setRefreshPostsFlag] = useState(false);

  const fetchUserData = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('❌ Session error:', sessionError.message);
        setUserData(null);
        return;
      }

      const user = session?.user;
      if (!user) {
        setUserData(null);
        return;
      }

      // ✅ Fetch extra profile details from 'profiles' table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, cover_url, description')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.warn('⚠️ Profile not found:', profileError.message);
        setUserData({
          id: user.id,
          email: user.email,
          ...user.user_metadata,
        });
      } else {
        setUserData({
          id: user.id,
          email: user.email,
          ...user.user_metadata,
          ...profileData,
        });
      }
    } catch (err) {
      console.error('❌ Unexpected error fetching user data:', err);
      setUserData(null);
    }
  };

  const refreshPosts = useCallback(() => {
    setRefreshPostsFlag(prev => !prev);
  }, []);

  useEffect(() => {
    fetchUserData();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // optional: log auth changes
      fetchUserData();
    });
    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        userData,
        fetchUserData,
        refreshPostsFlag,
        refreshPosts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
