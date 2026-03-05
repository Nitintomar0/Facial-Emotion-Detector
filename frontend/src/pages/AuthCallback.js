import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { Brain } from 'lucide-react';
import './Login.css';

function AuthCallback({ setUser }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Confirming your email...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the session after email confirmation
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setStatus('❌ Confirmation failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (session) {
          // Email confirmed and user logged in
          setUser(session.user);
          setStatus('✅ Email confirmed! Redirecting to dashboard...');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          // Email confirmed but not logged in
          setStatus('✅ Email confirmed! Please login to continue.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        console.error('Confirmation error:', err);
        setStatus('❌ An error occurred. Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleEmailConfirmation();
  }, [navigate, setUser]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Brain size={48} className="login-icon" />
          <h1>Vision AI</h1>
          <p>Email Confirmation</p>
        </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="spinner" style={{ margin: '20px auto' }}></div>
          <p style={{ fontSize: '18px', color: '#333', marginTop: '20px' }}>
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthCallback;
