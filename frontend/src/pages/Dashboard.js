import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Camera, Upload, BarChart3, Smile } from 'lucide-react';
import './Dashboard.css';

function Dashboard({ user, setUser }) {
  const features = [
    {
      icon: Camera,
      title: 'Live Analysis',
      description: 'Start real-time emotion detection using your webcam',
      link: '/live-analysis',
      color: '#667eea',
    },
    {
      icon: Upload,
      title: 'Upload & Analyze',
      description: 'Upload images or videos for emotion analysis',
      link: '/upload',
      color: '#764ba2',
    },
    {
      icon: BarChart3,
      title: 'Statistics',
      description: 'View your emotion detection history and insights',
      link: '/statistics',
      color: '#f093fb',
    },
  ];

  return (
    <div className="dashboard-container">
      <Navbar user={user} setUser={setUser} />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <Smile size={64} className="header-icon" />
          <h1>Welcome to Vision AI</h1>
          <p>AI-powered facial emotion recognition system</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="feature-card"
              style={{ '--card-color': feature.color }}
            >
              <div className="feature-icon">
                <feature.icon size={48} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="feature-arrow">→</div>
            </Link>
          ))}
        </div>

        <div className="info-section">
          <h2>Detected Emotions</h2>
          <div className="emotions-list">
            {['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'].map(
              (emotion) => (
                <div key={emotion} className="emotion-tag">
                  {emotion}
                </div>
              )
            )}
          </div>
        </div>

        <div className="info-section">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>Capture or Upload</h4>
              <p>Use your webcam for live analysis or upload an image/video</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h4>AI Analysis</h4>
              <p>Our CNN model detects faces and analyzes facial expressions</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h4>Get Results</h4>
              <p>View detected emotions with confidence levels and statistics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
