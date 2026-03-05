import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Camera, BarChart3, Upload, Video, Zap, Shield, Sparkles } from 'lucide-react';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="home-nav">
        <div className="nav-content">
          <div className="logo-section">
            <div className="animated-logo">
              <Brain className="logo-icon" />
              <span className="logo-text">Vision AI</span>
            </div>
          </div>
          <button onClick={() => navigate('/login')} className="nav-login-btn">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="gradient-text">AI-Powered</span>
              <br />
              Facial Emotion Recognition
            </h1>
            <p className="hero-description">
              Harness the power of deep learning to detect and analyze human emotions in real-time. 
              Our advanced CNN model recognizes 7 different emotions with high accuracy.
            </p>
            <div className="hero-buttons">
              <button onClick={() => navigate('/login')} className="btn-primary">
                <Sparkles size={20} />
                Start Analyzing
              </button>
              <button className="btn-secondary" onClick={() => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}>
                Learn More
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">7</div>
                <div className="stat-label">Emotions</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Accuracy</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">Real-time</div>
                <div className="stat-label">Detection</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <Camera size={32} />
              <span>Live Analysis</span>
            </div>
            <div className="floating-card card-2">
              <Upload size={32} />
              <span>Upload & Detect</span>
            </div>
            <div className="floating-card card-3">
              <BarChart3 size={32} />
              <span>Statistics</span>
            </div>
            <div className="center-logo">
              <Brain size={120} className="pulse-logo" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need for emotion detection and analysis</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <Video className="icon-gradient" />
              </div>
              <div className="feature-illustration">
                <div className="webcam-illustration">
                  <div className="webcam-frame">
                    <div className="webcam-dot"></div>
                    <div className="face-box">😊</div>
                  </div>
                </div>
              </div>
            </div>
            <h3>Live Camera Analysis</h3>
            <p>Real-time emotion detection from your webcam with instant visual feedback and bounding boxes on detected faces.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <Upload className="icon-gradient" />
              </div>
              <div className="feature-illustration">
                <div className="upload-illustration">
                  <div className="upload-box">
                    <div className="upload-arrow">↑</div>
                    <div className="upload-files">
                      <div className="file-icon">📷</div>
                      <div className="file-icon">🎥</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h3>Image & Video Upload</h3>
            <p>Upload photos or videos to analyze emotions with detailed confidence scores, visual overlays, and comprehensive results.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <BarChart3 className="icon-gradient" />
              </div>
              <div className="feature-illustration">
                <div className="chart-illustration">
                  <div className="chart-bars">
                    <div className="bar bar-1"></div>
                    <div className="bar bar-2"></div>
                    <div className="bar bar-3"></div>
                    <div className="bar bar-4"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3>Advanced Statistics</h3>
            <p>Track your analysis history with beautiful interactive charts, emotion trends, and detailed insights into patterns.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <Zap className="icon-gradient" />
              </div>
              <div className="feature-illustration">
                <div className="speed-illustration">
                  <div className="speed-lines">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                  </div>
                  <div className="speed-bolt">⚡</div>
                </div>
              </div>
            </div>
            <h3>Lightning Fast</h3>
            <p>Powered by optimized TensorFlow CNN model for instant emotion recognition with sub-second processing time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <Brain className="icon-gradient" />
              </div>
              <div className="feature-illustration">
                <div className="brain-illustration">
                  <div className="neural-network">
                    <div className="neuron"></div>
                    <div className="neuron"></div>
                    <div className="neuron"></div>
                    <div className="connection"></div>
                    <div className="connection"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3>Deep Learning</h3>
            <p>State-of-the-art convolutional neural network trained on thousands of facial expressions for accurate detection.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <Shield className="icon-gradient" />
              </div>
              <div className="feature-illustration">
                <div className="security-illustration">
                  <div className="shield-icon">🛡️</div>
                  <div className="lock-icon">🔒</div>
                </div>
              </div>
            </div>
            <h3>Secure & Private</h3>
            <p>Your data is protected with enterprise-grade security, encrypted storage, and privacy-first architecture.</p>
          </div>
        </div>
      </section>

      {/* Emotions Section */}
      <section className="emotions-section">
        <div className="section-header">
          <h2>7 Emotions Detected</h2>
          <p>Our AI can recognize these human emotions</p>
        </div>
        <div className="emotions-grid">
          <div className="emotion-item">
            <span className="emotion-emoji">😊</span>
            <span className="emotion-name">Happy</span>
          </div>
          <div className="emotion-item">
            <span className="emotion-emoji">😢</span>
            <span className="emotion-name">Sad</span>
          </div>
          <div className="emotion-item">
            <span className="emotion-emoji">😠</span>
            <span className="emotion-name">Angry</span>
          </div>
          <div className="emotion-item">
            <span className="emotion-emoji">😮</span>
            <span className="emotion-name">Surprise</span>
          </div>
          <div className="emotion-item">
            <span className="emotion-emoji">😨</span>
            <span className="emotion-name">Fear</span>
          </div>
          <div className="emotion-item">
            <span className="emotion-emoji">🤢</span>
            <span className="emotion-name">Disgust</span>
          </div>
          <div className="emotion-item">
            <span className="emotion-emoji">😐</span>
            <span className="emotion-name">Neutral</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Simple 3-step process</p>
        </div>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Capture or Upload</h3>
            <p>Use your webcam for live analysis or upload an image/video file</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our CNN model detects faces and analyzes facial expressions</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Get Results</h3>
            <p>View emotion labels, confidence scores, and detailed statistics</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Analyze Emotions?</h2>
          <p>Join thousands of users using Vision AI for emotion detection</p>
          <button onClick={() => navigate('/login')} className="cta-button">
            <Sparkles size={20} />
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Brain size={32} />
            <span>Vision AI</span>
          </div>
          <div className="footer-text">
            <p>AI-Powered Facial Emotion Recognition System</p>
            <p className="copyright">All rights reserved @coding warriors 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
