import React from 'react'
import './WhyLearn.css'

export default function WhyLearn() {
  return (
    <section className="why-learn-section">
      <div className="container">
        <h2 className="section-title">Why Learn with <span className="highlight">PrepGenius</span>?</h2>
        <div className="reasons-grid">
          <div className="reason-card">
            <h3>🎯 Goal-Oriented Learning</h3>
            <p>Our platform is designed to prepare you for real-world technical interviews through structured and focused practice.</p>
          </div>
          <div className="reason-card">
            <h3>🤖 AI Feedback</h3>
            <p>Get instant and actionable feedback from AI to help you improve your code quality and problem-solving approach.</p>
          </div>
          <div className="reason-card">
            <h3>💼 Industry-Level Questions</h3>
            <p>Practice questions that simulate real challenges asked by top tech companies like Google, Amazon, Meta, and Microsoft.</p>
          </div>
          <div className="reason-card">
            <h3>🌐 Learn Anytime, Anywhere</h3>
            <p>PrepGenius is 100% online. Practice from your laptop, tablet, or phone — whenever it works for you.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
