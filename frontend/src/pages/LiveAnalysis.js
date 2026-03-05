import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Camera, StopCircle, Save, Activity } from 'lucide-react';
import axios from 'axios';
import './LiveAnalysis.css';

function LiveAnalysis({ user, setUser }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState([]);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const intervalRef = useRef(null);
  const animationRef = useRef(null);
  const resultsRef = useRef([]);

  useEffect(() => {
    return () => {
      stopAnalysis();
    };
  }, []);

  const startAnalysis = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsAnalyzing(true);

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          
          // Small delay to ensure video is playing
          setTimeout(() => {
            startDrawing();
            
            // Start analyzing frames
            intervalRef.current = setInterval(() => {
              captureAndAnalyze();
            }, 1000); // Analyze every second
          }, 100);
        };
      }
    } catch (err) {
      setError('Failed to access camera. Please grant camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopAnalysis = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsAnalyzing(false);
    setResults([]);
    resultsRef.current = [];
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg');

    try {
      const response = await axios.post('/api/analyze-frame', {
        image: imageData,
      });

      if (response.data.success && response.data.results.length > 0) {
        console.log('API Response - Faces detected:', response.data.results.length);
        setResults(response.data.results);
        resultsRef.current = response.data.results;
      } else {
        console.log('API Response - No faces detected');
        setResults([]);
        resultsRef.current = [];
      }
    } catch (err) {
      console.error('Analysis error:', err);
    }
  };

  const startDrawing = () => {
    const drawFrame = () => {
      if (!overlayCanvasRef.current || !videoRef.current) return;
      
      const canvas = overlayCanvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match video
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log('Canvas sized to:', canvas.width, 'x', canvas.height);
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw results if available (use ref for latest data)
      if (resultsRef.current && resultsRef.current.length > 0) {
        drawResults(ctx, resultsRef.current);
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(drawFrame);
    };
    
    drawFrame();
  };

  // Emoji mapping for emotions
  const getEmotionEmoji = (emotion) => {
    const emojiMap = {
      'Happy': '😊',
      'Sad': '😢',
      'Angry': '😠',
      'Surprise': '😮',
      'Fear': '😨',
      'Disgust': '🤢',
      'Neutral': '😐'
    };
    return emojiMap[emotion] || '😐';
  };

  const drawResults = (context, results) => {
    if (!results || results.length === 0) {
      console.log('No results to draw');
      return;
    }
    
    console.log('Drawing results:', results.length, 'faces');
    
    results.forEach((result, index) => {
      const { x, y, w, h } = result.bbox;
      const emotion = result.emotion;
      const confidence = (result.confidence * 100).toFixed(1);
      const emoji = getEmotionEmoji(emotion);

      console.log(`Drawing face ${index + 1}:`, { x, y, w, h, emotion, confidence });

      // Draw YELLOW rectangle (like upload page)
      context.strokeStyle = '#FFFF00';
      context.lineWidth = 3;
      context.strokeRect(x, y, w, h);

      // Draw emoji on the left side of the label
      const labelText = `${emoji} ${emotion} (${confidence}%)`;
      context.font = 'bold 20px Arial';
      const textMetrics = context.measureText(labelText);
      const textWidth = textMetrics.width;
      const padding = 10;
      const labelHeight = 35;
      
      // Position label at top of box (above the rectangle)
      const labelX = x;
      const labelY = y - labelHeight - 5;
      
      // Draw semi-transparent black background for better readability
      context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      context.fillRect(labelX, labelY, textWidth + padding * 2, labelHeight);
      
      // Draw GREEN text with emoji (like upload page)
      context.fillStyle = '#00FF00';
      context.fillText(labelText, labelX + padding, labelY + 25);
      
      // Draw person number badge if multiple faces
      if (results.length > 1) {
        context.font = 'bold 14px Arial';
        const numberText = `#${index + 1}`;
        const numberWidth = context.measureText(numberText).width;
        
        // White badge in top-left corner
        context.fillStyle = 'rgba(255, 255, 255, 0.95)';
        context.fillRect(x + 5, y + 5, numberWidth + 16, 24);
        
        // Black text
        context.fillStyle = '#000';
        context.fillText(numberText, x + 13, y + 22);
      }
    });
  };

  const saveAnalysis = async () => {
    if (results.length === 0) {
      alert('No results to save');
      return;
    }

    try {
      await axios.post('/api/save-analysis', {
        user_id: user.id,
        results: results,
      });
      alert('Analysis saved successfully!');
    } catch (err) {
      alert('Failed to save analysis');
      console.error('Save error:', err);
    }
  };

  return (
    <div className="live-analysis-container">
      <Navbar user={user} setUser={setUser} />

      <div className="live-analysis-content">
        <h1>Live Emotion Analysis</h1>

        <div className="split-view-container">
          {/* Left Side - Camera Feed */}
          <div className="camera-section">
            <div className="section-header">
              <Camera size={24} />
              <h2>Camera Feed</h2>
            </div>
            
            <div className="video-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="video-feed"
              />
              <canvas 
                ref={overlayCanvasRef} 
                className="overlay-canvas"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {!isAnalyzing && (
                <div className="video-overlay">
                  <Camera size={64} />
                  <p>Click "Start Live Analysis" to begin</p>
                </div>
              )}
              {isAnalyzing && results.length === 0 && (
                <div className="analyzing-overlay">
                  <div className="pulse-dot"></div>
                  <p>Analyzing...</p>
                </div>
              )}
            </div>

            <div className="controls">
              {!isAnalyzing ? (
                <button onClick={startAnalysis} className="btn btn-start">
                  <Camera size={20} />
                  Start Live Analysis
                </button>
              ) : (
                <>
                  <button onClick={stopAnalysis} className="btn btn-stop">
                    <StopCircle size={20} />
                    Stop Analysis
                  </button>
                  <button onClick={saveAnalysis} className="btn btn-save">
                    <Save size={20} />
                    Save Results
                  </button>
                </>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>

          {/* Right Side - Results */}
          <div className="results-section">
            <div className="section-header">
              <Activity size={24} />
              <h2>Detection Results</h2>
            </div>
            
            {!isAnalyzing && results.length === 0 && (
              <div className="empty-state">
                <Camera size={48} className="empty-icon" />
                <p>Start live analysis to see results</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="results-content">
                <div className="results-grid">
                {results.map((result, index) => (
                  <div key={index} className="result-card">
                    <div className="result-header">
                      <div className="result-emotion-with-emoji">
                        <span className="emotion-emoji">{getEmotionEmoji(result.emotion)}</span>
                        <span>{result.emotion}</span>
                        {results.length > 1 && <span className="person-badge">Person #{index + 1}</span>}
                      </div>
                      <div className="result-confidence">
                        {(result.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    
                    <div className="result-probabilities">
                      <h4>Emotion Breakdown:</h4>
                      {Object.entries(result.probabilities)
                        .sort(([, a], [, b]) => b - a)
                        .map(([emotion, prob]) => (
                        <div key={emotion} className="probability-item">
                          <span className="emotion-name">{emotion}</span>
                          <div className="probability-bar-container">
                            <div className="probability-bar">
                              <div
                                className="probability-fill"
                                style={{ 
                                  width: `${prob * 100}%`,
                                  backgroundColor: emotion === result.emotion ? '#00FF00' : '#667eea'
                                }}
                              />
                            </div>
                            <span className="probability-value">{(prob * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="live-stats">
                <div className="stat-item">
                  <span className="stat-label">Faces Detected:</span>
                  <span className="stat-value">{results.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Status:</span>
                  <span className="stat-value status-active">● Live</span>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveAnalysis;
