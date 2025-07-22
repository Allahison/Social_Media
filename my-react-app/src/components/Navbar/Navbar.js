// ✅ UPDATED NAVBAR WITH PROFILE TABLE SEARCH
import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import {
  FaHome, FaUserFriends, FaTv, FaStore, FaUsers, FaSearch, FaBell,
  FaFacebookMessenger, FaCaretDown, FaCog, FaQuestionCircle,
  FaSignOutAlt, FaGamepad
} from 'react-icons/fa';
import { supabase } from '../../supabaseClient';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import NotificationList from '../Follow/NotificationList';
import UserSearchModal from '../../components/Navbar/UserSearchModal';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [noResult, setNoResult] = useState(false);

  const dropdownRef = useRef(null);
  const bellRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useUser();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!userData?.id) return;

      const [likeRes, followRes] = await Promise.all([
        supabase
          .from('like_notifications')
          .select('id', { count: 'exact' })
          .eq('receiver_id', userData.id)
          .eq('is_read', false),

        supabase
          .from('notifications')
          .select('id', { count: 'exact' })
          .eq('receiver_id', userData.id)
          .eq('is_read', false)
      ]);

      setNotificationCount((likeRes.count || 0) + (followRes.count || 0));
    };

    fetchUnreadCount();
  }, [userData]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/login');
    else console.error('Logout failed:', error.message);
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('full_name', `%${searchValue.trim()}%`);

      if (error || !data || data.length === 0) {
        setSearchedUser(null);
        setNoResult(true);
        setShowModal(true);
      } else {
        setSearchedUser(data[0]);
        setNoResult(false);
        setShowModal(true);
      }
    }
  };

  const avatarUrl = userData?.avatar_url || '/assets/images/default-avatar.png';
  const fullName = userData?.full_name || 'User';
  const email = userData?.email || 'user@example.com';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <img src="/assets/photos/logo.png" alt="Logo" className="logo" />
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by username..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      <div className="navbar-center">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-icon ${isActive ? 'active' : ''}`}>
          <FaHome />
        </NavLink>
        <NavLink to="/gaming" className={({ isActive }) => `nav-icon ${isActive ? 'active' : ''}`}>
          <FaGamepad />
        </NavLink>
        <NavLink to="/videos" className={({ isActive }) => `nav-icon ${isActive ? 'active' : ''}`}>
          <FaTv />
        </NavLink>
        <NavLink to="/store" className={({ isActive }) => `nav-icon ${isActive ? 'active' : ''}`}>
          <FaStore />
        </NavLink>
        <NavLink to="/groups" className={({ isActive }) => `nav-icon ${isActive ? 'active' : ''}`}>
          <FaUsers />
        </NavLink>
      </div>

      <div className="navbar-right" ref={dropdownRef}>
        <div className="nav-circle">
          <FaFacebookMessenger />
        </div>

        <div className="nav-circle" onClick={toggleNotifications} ref={bellRef} style={{ position: 'relative' }}>
          <FaBell />
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </div>

        {showNotifications && (
          <div className="notification-dropdown">
            <NotificationList setNotificationCount={setNotificationCount} />
          </div>
        )}

        {isDashboard && (
          <div className="nav-circle nav-user" onClick={toggleDropdown}>
            <img src={avatarUrl} alt="Avatar" className="nav-avatar" />
            <FaCaretDown className="dropdown-caret" />
          </div>
        )}

        {dropdownOpen && isDashboard && (
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <img src={avatarUrl} alt="Avatar" className="dropdown-avatar" />
              <div className="dropdown-info">
                <strong>{fullName}</strong>
                <small>{email}</small>
              </div>
            </div>

            <div className="dropdown-divider" />

            <div className="dropdown-item">
              <FaCog className="dropdown-icon-left" />
              Settings
            </div>

            <div className="dropdown-item">
              <FaQuestionCircle className="dropdown-icon-left" />
              Help & Support
            </div>

            <div className="dropdown-item" onClick={handleLogout}>
              <FaSignOutAlt className="dropdown-icon-left" />
              Logout
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <UserSearchModal
          user={searchedUser}
          onClose={() => setShowModal(false)}
          noResult={noResult}
        />
      )}
    </header>
  );
}
