import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AnalyticsDashboard() {
  const { token } = useAuth();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [recommendationAnalytics, setRecommendationAnalytics] = useState(null);
  const [gemstoneAnalytics, setGemstoneAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllAnalytics();
  }, [token]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoints = [
        '/api/admin/analytics/dashboard',
        '/api/admin/analytics/users',
        '/api/admin/analytics/recommendations',
        '/api/admin/analytics/gemstones',
      ];

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json())
        )
      );

      setDashboardStats(responses[0]);
      setUserAnalytics(responses[1]);
      setRecommendationAnalytics(responses[2]);
      setGemstoneAnalytics(responses[3]);
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Analytics Dashboard</h1>

      {/* Dashboard Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Total Users</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8B7355' }}>
            {dashboardStats?.totalUsers || 0}
          </p>
        </div>
        <div className="panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Total Recommendations</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#D4A574' }}>
            {dashboardStats?.totalRecommendations || 0}
          </p>
        </div>
        <div className="panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Total Gemstones</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8B7355' }}>
            {dashboardStats?.totalGemstones || 0}
          </p>
        </div>
        <div className="panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Admin Users</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#D4A574' }}>
            {dashboardStats?.adminCount || 0}
          </p>
        </div>
      </div>

      {/* User Analytics */}
      <div className="panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2>User Analytics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>New Users This Month</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {userAnalytics?.newUsersThisMonth || 0}
            </p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Active Users (7 days)</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {userAnalytics?.activeUsers || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation Analytics */}
      <div className="panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h2>Recommendation Analytics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Daily Recommendations</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {recommendationAnalytics?.dailyRecommendations || 0}
            </p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Weekly Recommendations</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {recommendationAnalytics?.weeklyRecommendations || 0}
            </p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Monthly Recommendations</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {recommendationAnalytics?.monthlyRecommendations || 0}
            </p>
          </div>
        </div>

        {recommendationAnalytics?.dailyTrend && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Daily Trend (Last 7 Days)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {recommendationAnalytics.dailyTrend.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem' }}>{item.date}</td>
                    <td style={{ padding: '0.5rem' }}>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gemstone Analytics */}
      <div className="panel" style={{ padding: '1.5rem' }}>
        <h2>Gemstone Analytics</h2>

        {gemstoneAnalytics?.highestRated && gemstoneAnalytics.highestRated.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3>Highest Rated Gemstones</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Gemstone</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Rating</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Reviews</th>
                </tr>
              </thead>
              <tbody>
                {gemstoneAnalytics.highestRated.map((gem) => (
                  <tr key={gem._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem' }}>{gem.name}</td>
                    <td style={{ padding: '0.5rem' }}>{gem.averageRating.toFixed(1)} ⭐</td>
                    <td style={{ padding: '0.5rem' }}>{gem.totalReviews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {gemstoneAnalytics?.mostRecommended && gemstoneAnalytics.mostRecommended.length > 0 && (
          <div>
            <h3>Most Recommended Gemstones</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Gemstone</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Recommendations</th>
                </tr>
              </thead>
              <tbody>
                {gemstoneAnalytics.mostRecommended.map((item) => (
                  <tr key={item.gemstone._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem' }}>{item.gemstone.name}</td>
                    <td style={{ padding: '0.5rem' }}>{item.recommendationCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button
        onClick={fetchAllAnalytics}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          background: '#8B7355',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Refresh Analytics
      </button>
    </div>
  );
}
