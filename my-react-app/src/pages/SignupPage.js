import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './SignupPage.css';
import logo from '../../public/assets/photos/logo.png';
import illustration from '../../public/assets/photos/signup-illustration.png';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setPopupMessage('');

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
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
      navigate('/setup-profile');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    evaluatePasswordStrength(value);
  };

  const evaluatePasswordStrength = (pass) => {
    if (pass.length < 6) {
      setPasswordStrength('Weak');
    } else if (pass.match(/[a-z]/) && pass.match(/[A-Z]/) && pass.match(/[0-9]/)) {
      setPasswordStrength('Strong');
    } else {
      setPasswordStrength('Medium');
    }
  };

  return (
    <>
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

            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="form-input"
              />
              <span
                className="toggle-password-icon"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? '👁️' : '🙈'}
              </span>
              {password && (
                <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                  Strength: {passwordStrength}
                </p>
              )}
            </div>

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
