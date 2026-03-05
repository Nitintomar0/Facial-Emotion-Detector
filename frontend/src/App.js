import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from './utils/supabase';
import Home from './pages/Home';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import LiveAnalysis from './pages/LiveAnalysis';
import UploadAnalysis from './pages/UploadAnalysis';
import Statistics from './pages/Statistics';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setLoading(false);
      // Don't auto-login as guest, let user choose from home page
      return;
    }

    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />}
          />
          <Route
            path="/auth/callback"
            element={<AuthCallback setUser={setUser} />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />}
          />
          <Route
            path="/live-analysis"
            element={user ? <LiveAnalysis user={user} setUser={setUser} /> : <Navigate to="/login" />}
          />
          <Route
            path="/upload"
            element={user ? <UploadAnalysis user={user} setUser={setUser} /> : <Navigate to="/login" />}
          />
          <Route
            path="/statistics"
            element={user ? <Statistics user={user} setUser={setUser} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
