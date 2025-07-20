// src/components/HeroVideo/HeroVideo.jsx
import React from 'react';
import './HeroVideo.css';
import backgroundVideo from '../../../public/assets/video/123.mp4';

export default function HeroVideo() {
  return (
    <section className="hero-video-section">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="background-video"
        aria-hidden="true"
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="video-overlay">
        <h1 className="hero-title">Built for Real-World Job Interviews</h1>
        <p className="hero-subtitle">
          Elevate your skills with mock interviews, AI feedback, and coding challenges.
        </p>
      </div>
    </section>
  );
}
