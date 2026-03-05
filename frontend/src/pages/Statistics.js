import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Calendar } from 'lucide-react';
import axios from 'axios';
import './Statistics.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140'];

function Statistics({ user, setUser }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/statistics/${user.id}`);
      setStats(response.data);
      setError('');
    } catch (err) {
      console.error('Statistics error:', err);
      // If in guest mode or no data, show empty state instead of error
      if (user.id === 'guest' || err.response?.status === 500) {
        setStats({
          total_analyses: 0,
          emotion_distribution: {},
          analyses_by_type: { image: 0, video: 0, live: 0 },
          recent_analyses: []
        });
        setError('');
      } else {
        setError('Failed to load statistics');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="statistics-container">
        <Navbar user={user} setUser={setUser} />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-container">
        <Navbar user={user} setUser={setUser} />
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const emotionData = Object.entries(stats.emotion_distribution || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const analysisTypeData = Object.entries(stats.analyses_by_type || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  return (
    <div className="statistics-container">
      <Navbar user={user} setUser={setUser} />

      <div className="statistics-content">
        <h1>Your Statistics</h1>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#667eea' }}>
              <Activity size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.total_analyses}</div>
              <div className="stat-label">Total Analyses</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#764ba2' }}>
              <TrendingUp size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-value">
                {emotionData.length > 0
                  ? emotionData.reduce((max, item) => (item.value > max.value ? item : max))
                      .name
                  : 'N/A'}
              </div>
              <div className="stat-label">Most Common Emotion</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f093fb' }}>
              <Calendar size={32} />
            </div>
            <div className="stat-info">
              <div className="stat-value">
                {stats.analyses_by_type.image + stats.analyses_by_type.video}
              </div>
              <div className="stat-label">Files Analyzed</div>
            </div>
          </div>
        </div>

        {emotionData.length > 0 ? (
          <>
            <div className="charts-section">
              <div className="chart-card">
                <h2>Emotion Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={emotionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h2>Emotion Breakdown</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={emotionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {emotionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card full-width">
              <h2>Analysis Types</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analysisTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#764ba2" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {stats.recent_analyses && stats.recent_analyses.length > 0 && (
              <div className="recent-analyses">
                <h2>Recent Analyses</h2>
                <div className="analyses-list">
                  {stats.recent_analyses.map((analysis, index) => (
                    <div key={index} className="analysis-item">
                      <div className="analysis-type">
                        {analysis.analysis_type.charAt(0).toUpperCase() +
                          analysis.analysis_type.slice(1)}
                      </div>
                      <div className="analysis-date">
                        {new Date(analysis.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="no-data">
            <Activity size={64} />
            <h2>No Statistics Yet</h2>
            <p>Start analyzing emotions to see your statistics here!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;
