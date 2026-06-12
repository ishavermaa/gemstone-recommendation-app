import { Heart, History, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getFavorites } from '../services/favoriteService.js';
import { getRecommendations } from '../services/recommendationService.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    Promise.all([getRecommendations(), getFavorites()]).then(([recData, favData]) => {
      setRecommendations(recData.recommendations);
      setFavorites(favData.favorites);
    });
  }, []);

  return (
    <section className="section">
      <div className="dashboard-head">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
        <Link className="primary-btn" to="/recommend"><Sparkles size={16} /> New Recommendation</Link>
      </div>
      <div className="grid three stats">
        <div className="stat"><History /><strong>{recommendations.length}</strong><span>Recommendations</span></div>
        <div className="stat"><Heart /><strong>{favorites.length}</strong><span>Favorites</span></div>
        <div className="stat"><Sparkles /><strong>{recommendations[0]?.gemstoneId?.name || 'None yet'}</strong><span>Latest match</span></div>
      </div>
      <div className="two-col">
        <div className="panel">
          <h2>Recommendation history</h2>
          <div className="activity-list">
            {recommendations.map((item) => (
              <div key={item._id}>
                <strong>{item.gemstoneId?.name}</strong>
                <span>{item.goal} - {item.matchScore}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h2>Saved gemstones</h2>
          <div className="activity-list">
            {favorites.map((item) => (
              <div key={item._id}>
                <strong>{item.gemstoneId?.name}</strong>
                <span>{item.gemstoneId?.planet} - {item.gemstoneId?.color}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
