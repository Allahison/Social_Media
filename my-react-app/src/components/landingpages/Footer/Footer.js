// src/components/Footer.jsx
import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-brand">
          <h2>Prep<span className="highlight">Genius</span></h2>
          <p>Smart tools for mastering interviews, the genius way.</p>
        </div>

        {/* Social Links */}
        <div className="footer-social">
          <h4>Connect with us</h4>
          <div className="social-icons">
            <a href="https://www.linkedin.com/in/muhammed-arslan-aa8808276/" target="_blank" rel="noopener noreferrer" className="icon github">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/muhammed-arslan-aa8808276/" target="_blank" rel="noopener noreferrer" className="icon linkedin">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100009200415732" target="_blank" rel="noopener noreferrer" className="icon facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>

        {/* Info Links */}
        <div className="footer-links">
          <h4>Resources</h4>
          <ul>
            <li><a href="https://restfulapi.net">REST APIs</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">JavaScript</a></li>
            <li><a href="https://react.dev">React</a></li>
            <li><a href="https://www.python.org">Python</a></li>
            <li><a href="https://github.com/ryanmcdermott/clean-code-javascript">Clean Code</a></li>
          </ul>
        </div>

        <div className="footer-about">
          <h4>About</h4>
          <ul>
            <li><a href="https://opensource.guide">Open Source</a></li>
            <li><a href="https://opencollective.com">Support</a></li>
            <li><a href="	https://www.privacypolicies.com">Privacy Policy</a></li>
            <li><a href="https://termsfeed.com ">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="footer-disclaimer">
        <p>PrepGenius is a student-driven educational initiative providing mock interview tools and coding resources. Donations and community support help us grow and remain free.</p>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} PrepGenius. All rights reserved.</p>
      </div>
    </footer>
  )
}
