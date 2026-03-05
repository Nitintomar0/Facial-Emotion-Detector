import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import { Brain } from 'lucide-react';
import './Login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isSupabaseConfigured()) {
      // Guest mode
      setUser({ id: 'guest', email: 'guest@local' });
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/auth/callback'
          }
        });
        if (error) throw error;
        if (data.user) {
          setError('');
          // Check if email confirmation is required
          if (data.user.identities && data.user.identities.length === 0) {
            alert('✅ Account created! Please check your email to confirm your account before signing in.');
          } else {
            alert('✅ Account created! You can now sign in.');
          }
          setIsSignUp(false);
          setEmail('');
          setPassword('');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          // Provide helpful error messages
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('❌ Invalid email or password. Please check your credentials or sign up if you don\'t have an account.');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('❌ Please confirm your email address. Check your inbox for the confirmation link.');
          } else {
            throw error;
          }
        }
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    setUser({ id: 'guest', email: 'guest@local' });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Brain size={48} className="login-icon" />
          <h1>Vision AI</h1>
          <p>AI-Powered Facial Emotion Recognition</p>
        </div>

        {!isSupabaseConfigured() ? (
          <div className="guest-mode">
            <p className="info-text">
              Supabase is not configured. You can continue in guest mode without authentication.
            </p>
            <button onClick={handleGuestMode} className="btn btn-primary">
              Continue as Guest
            </button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            
            {!isSignUp && (
              <div className="info-box">
                <p style={{fontSize: '13px', color: '#666', margin: '0'}}>
                  💡 <strong>First time?</strong> Click "Sign Up" below to create an account. 
                  You'll receive a confirmation email - check your inbox (and spam folder)!
                </p>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

            <div className="toggle-auth">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="link-button"
              >
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </button>
            </div>

            <div className="divider">OR</div>

            <button type="button" onClick={handleGuestMode} className="btn btn-secondary">
              Continue as Guest
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
