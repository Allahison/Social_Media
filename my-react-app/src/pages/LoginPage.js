import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './LoginPage.css';
import logo from '../../public/assets/photos/logo.png';
import illustration from '../../public/assets/photos/signup-illustration.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      return;
    }

    // ✅ Get the user's metadata
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user) {
      setError('Unable to fetch user info.');
      return;
    }

    const { full_name, avatar_url } = user.user_metadata;

    // ✅ Check if the profile is incomplete
    if (!full_name || !avatar_url) {
      navigate('/setup-profile',)
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      
      <div className="login-page-container">
        {/* Left Panel */}
        <div className="login-left-panel">
          <h1 className="brand-title">CodeCraft</h1>
          <p className="brand-subtitle">
            Elevate your career with real-world mock interviews and AI-powered feedback.
          </p>
          <img src={illustration} alt="Interview prep" className="illustration" />
        </div>

        {/* Right Panel */}
        <div className="login-right-panel">
          <form onSubmit={handleLogin} className="login-form">
            <img src={logo} alt="Logo" className="form-logo" />
            <h2 className="form-title">Login</h2>
            {error && <p className="form-error">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <button type="submit" className="form-button">Login</button>

            {/* Signup Link */}
            <p className="form-footer-text">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="form-link">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}