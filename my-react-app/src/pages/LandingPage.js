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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check user session
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user && !error) {
        setUser(data.user);
      } else {
        setUser(null); // new or logged out user
      }
      setIsLoading(false);
    };

    getUser();

    // Optional: Re-check on auth state change
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    // Cleanup
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) return null; // ⏳ Optionally show loader here

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <HeroVideo />

      {/* Floating Action Button */}
      <a
        href={user ? '/dashboard' : '/signup'}
        className="floating-action-btn"
      >
        {user ? 'Dashboard' : 'Get Started'}
      </a>



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
  );
}
