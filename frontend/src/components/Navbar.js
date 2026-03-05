import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Camera, Upload, BarChart3, LogOut, Home } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../utils/supabase';
import './Navbar.css';

function Navbar({ user, setUser }) {
  const location = useLocation();

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/live-analysis', icon: Camera, label: 'Live Analysis' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/statistics', icon: BarChart3, label: 'Statistics' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Brain size={32} />
        <span>Vision AI</span>
      </div>

      <div className="navbar-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="navbar-user">
        <span className="user-email">{user?.email}</span>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
