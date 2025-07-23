import React from 'react';
import './WhyJoin.css';

export default function WhyJoin() {
  return (
    <section className="why-join-section">
      <div className="container">
        <h2 className="section-title">
          Why Join <span className="highlight">SocialSphere</span> – The Future of Social Connection?
        </h2>
        <div className="reasons-grid">
          <div className="reason-card">
            <h3>🌟 Express Yourself Freely</h3>
            <p>
              Share your thoughts, photos, and videos with a vibrant community that values creativity,
              authenticity, and real connections.
            </p>
          </div>
          <div className="reason-card">
            <h3>🤖 Smart Content Discovery</h3>
            <p>
              Our intelligent algorithms help you discover content you love and people who inspire —
              tailored just for your interests.
            </p>
          </div>
          <div className="reason-card">
            <h3>🛡️ Built-In Privacy Controls</h3>
            <p>
              You’re in control. Customize your profile, control who sees your posts, and enjoy a safe
              digital space built around trust.
            </p>
          </div>
          <div className="reason-card">
            <h3>📱 Seamless Experience</h3>
            <p>
              Whether you're on mobile or desktop, SocialSphere offers a smooth, fast, and beautiful
              experience — anywhere, anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
