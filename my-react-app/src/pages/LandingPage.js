// src/pages/LandingPage.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './LandingPage.css';
import Footer from '../components/landingpages/Footer/Footer';
import TeamSection from '../components/landingpages/TeamSection/TeamSection';
import WhyLearn from '../components/landingpages/learn/WhyLearn';
import HeroVideo from '../components/HeroVideo/HeroVideo';

export default function LandingPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  return (
    <>

    <div className="landing-page">
      {/* Hero Section (Video Background) */}
      <HeroVideo />

      {/* Floating Get Started Button */}
      <a
        href={user ? '/dashboard' : '/signup'}
        className="floating-action-btn"
      >
        {user ? 'Dashboard' : 'Get Started'}
      </a>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="headline">Ace Your Interviews</h2>
        <p className="subtext">AI-powered mock interviews with instant feedback.</p>
      </main>

      {/* Why Learn Section */}
      <section className="why-learn-wrapper">
        <WhyLearn />
      </section>

      {/* Team Section */}
      <section className="team-section-wrapper">
        <TeamSection />
      </section>

      {/* Footer */}
      <Footer />
    </div>
    </>
  );
}
