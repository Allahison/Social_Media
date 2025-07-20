import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './SignupPage.css';
import { Helmet } from 'react-helmet';
import logo from '../../public/assets/photos/logo.png';
import illustration from '../../public/assets/photos/login2.png';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setPopupMessage('');

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`, // ✅ after confirm, go to /login
        data: {
          full_name: fullName,
          avatar_url: '',
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      return;
    }

    if (data.user && !data.session) {
      setPopupMessage('✅ Signup successful! Please check your email to confirm your account.');
    } else if (data.session) {
      // This will rarely happen if "Email Confirm" is required
      navigate('/setup-profile');
    }
  };

  return (
    <>
      <Helmet>
        <title>Signup | CodeCraft</title>
      </Helmet>
      <div className="login-page-container">
        <div className="login-left-panel">
          <h1 className="brand-title">CodeCraft</h1>
          <p className="brand-subtitle">
            Elevate your career with real-world mock interviews.
          </p>
          <img src={illustration} alt="Signup Illustration" className="illustration" />
        </div>

        <div className="login-right-panel">
          <form onSubmit={handleSignup} className="login-form">
            <img src={logo} alt="Logo" className="form-logo" />
            <h2 className="form-title">Sign Up</h2>

            {error && <p className="form-error">{error}</p>}
            {popupMessage && <p className="form-success">{popupMessage}</p>}

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="form-input"
            />
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
            <button type="submit" className="form-button">Sign Up</button>

            <p className="form-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="form-link">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
