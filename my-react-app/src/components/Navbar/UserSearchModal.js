// src/components/Navbar/UserSearchModal.jsx
import React from 'react';
import './UserSearchModal.css';
import { Link } from 'react-router-dom';

const UserSearchModal = ({ user, onClose, noResult }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>

        {noResult ? (
          <h3>No user found with this username.</h3>
        ) : (
          <>
            <img
              src={user?.avatar_url || '/default-avatar.png'}
              alt="Avatar"
              className="avatar"
            />
            <h2>{user?.username}</h2>
            <p><strong>Full Name:</strong> {user?.full_name}</p>
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Bio:</strong> {user?.description}</p>
            <p><strong>Joined:</strong> {new Date(user?.updated_at).toLocaleDateString()}</p>

            <Link to={`/user/${user?.id}`} className="visit-btn">
              Visit Profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default UserSearchModal;
