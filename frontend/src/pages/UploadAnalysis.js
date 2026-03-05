import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Upload, Image as ImageIcon, Video, Loader } from 'lucide-react';
import axios from 'axios';
import './UploadAnalysis.css';

function UploadAnalysis({ user, setUser }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setResults(null);
    setError('');

    // Determine file type
    if (file.type.startsWith('image/')) {
      setFileType('image');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      setFileType('video');
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append(fileType, selectedFile);
    formData.append('user_id', user.id);

    try {
      const endpoint = fileType === 'image' ? '/api/analyze-image' : '/api/analyze-video';
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(response.data);
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileType(null);
    setPreview(null);
    setResults(null);
    setError('');
  };

  return (
    <div className="upload-analysis-container">
      <Navbar user={user} setUser={setUser} />

      <div className="upload-analysis-content">
        <h1>Upload & Analyze</h1>

        <div className="upload-section">
          {!selectedFile ? (
            <div className="upload-area">
              <input
                type="file"
                id="file-input"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-input" className="upload-label">
                <Upload size={64} />
                <h3>Upload Image or Video</h3>
                <p>Click to browse or drag and drop</p>
                <div className="supported-formats">
                  <div className="format-tag">
                    <ImageIcon size={16} />
                    <span>Images (JPG, PNG, etc.)</span>
                  </div>
                  <div className="format-tag">
                    <Video size={16} />
                    <span>Videos (MP4, AVI, etc.)</span>
                  </div>
                </div>
              </label>
            </div>
          ) : (
            <div className="preview-section">
              <div className="preview-container">
                {fileType === 'image' ? (
                  <img src={preview} alt="Preview" className="preview-media" />
                ) : (
                  <video src={preview} controls className="preview-media" />
                )}
              </div>

              <div className="file-info">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-size">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div className="action-buttons">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="btn btn-analyze"
                >
                  {analyzing ? (
                    <>
                      <Loader size={20} className="spinner" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Analyze {fileType === 'image' ? 'Image' : 'Video'}
                    </>
                  )}
                </button>
                <button onClick={handleReset} className="btn btn-reset">
                  Choose Another File
                </button>
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>

        {results && (
          <div className="results-section">
            <h2>Analysis Results</h2>

            {fileType === 'image' && results.processed_image && (
              <div className="processed-image-container">
                <h3>Processed Image</h3>
                <img
                  src={`data:image/jpeg;base64,${results.processed_image}`}
                  alt="Processed"
                  className="processed-image"
                />
              </div>
            )}

            {fileType === 'image' && results.results && (
              <div className="detection-results">
                <h3>Detected Faces: {results.faces_detected}</h3>
                <div className="results-grid">
                  {results.results.map((result, index) => (
                    <div key={index} className="result-card">
                      <div className="result-header">
                        <span className="face-number">Face {index + 1}</span>
                        <span className="result-emotion">{result.emotion}</span>
                      </div>
                      <div className="confidence-section">
                        <div className="confidence-label">
                          Confidence: {(result.confidence * 100).toFixed(1)}%
                        </div>
                        <div className="confidence-bar">
                          <div
                            className="confidence-fill"
                            style={{ width: `${result.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="probabilities">
                        <h4>All Emotions:</h4>
                        {Object.entries(result.probabilities)
                          .sort((a, b) => b[1] - a[1])
                          .map(([emotion, prob]) => (
                            <div key={emotion} className="prob-item">
                              <span>{emotion}</span>
                              <span>{(prob * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fileType === 'video' && results.summary && (
              <div className="video-summary">
                <h3>Video Analysis Summary</h3>
                <div className="summary-grid">
                  <div className="summary-card">
                    <div className="summary-label">Dominant Emotion</div>
                    <div className="summary-value">
                      {results.summary.dominant_emotion || 'None detected'}
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-label">Average Confidence</div>
                    <div className="summary-value">
                      {(results.summary.average_confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-label">Total Faces Detected</div>
                    <div className="summary-value">
                      {results.summary.total_faces_detected}
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-label">Frames Analyzed</div>
                    <div className="summary-value">
                      {results.summary.frames_analyzed}
                    </div>
                  </div>
                </div>

                {results.summary.emotion_distribution && (
                  <div className="emotion-distribution">
                    <h4>Emotion Distribution</h4>
                    <div className="distribution-bars">
                      {Object.entries(results.summary.emotion_distribution).map(
                        ([emotion, count]) => (
                          <div key={emotion} className="distribution-item">
                            <span className="emotion-name">{emotion}</span>
                            <div className="distribution-bar">
                              <div
                                className="distribution-fill"
                                style={{
                                  width: `${
                                    (count / results.summary.total_faces_detected) * 100
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="emotion-count">{count}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadAnalysis;
