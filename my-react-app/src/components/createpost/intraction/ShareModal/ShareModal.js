import React from 'react';
import './ShareModal.css';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';

export default function ShareModal({ url, onClose }) {
  const encodedURL = encodeURIComponent(url);

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Share This Post</h3>
        <div className="share-options">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-icon facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodedURL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-icon whatsapp"
          >
            <FaWhatsapp />
          </a>
          <a
            href={`https://www.instagram.com/`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-icon instagram"
          >
            <FaInstagram />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-icon linkedin"
          >
            <FaLinkedinIn />
          </a>
          <a
            href={`mailto:?subject=Check this out&body=${encodedURL}`}
            className="share-icon email"
          >
            <FaEnvelope />
          </a>
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
