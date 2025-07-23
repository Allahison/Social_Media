// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-brand">
          <h2>Social<span className="highlight">Sphere</span></h2>
          <p>Connect. Share. Grow — where communities thrive together.</p>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://github.com/muhammadarslan" target="_blank" rel="noopener noreferrer" className="icon github">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/muhammed-arslan-aa8808276/" target="_blank" rel="noopener noreferrer" className="icon linkedin">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100009200415732" target="_blank" rel="noopener noreferrer" className="icon facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="icon instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="icon twitter">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><a href="/explore">Discover</a></li>
            <li><a href="/trending">Trending</a></li>
            <li><a href="/creators">Top Creators</a></li>
            <li><a href="/groups">Communities</a></li>
            <li><a href="/events">Events</a></li>
          </ul>
        </div>

        {/* Help & Legal */}
        <div className="footer-about">
          <h4>Help & Info</h4>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/safety">Safety</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="footer-disclaimer">
        <p>SocialSphere is a place for real connections. Our goal is to create a safe and welcoming space for everyone to share, connect, and build community.</p>
      </div>

      {/* Bottom Line */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SocialSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}
