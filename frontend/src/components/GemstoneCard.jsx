import { Heart, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { addFavorite } from '../services/favoriteService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function GemstoneCard({ gemstone }) {
  const { user } = useAuth();
  const { notify } = useNotifications();

  const saveFavorite = async () => {
    if (!user) {
      notify('Login to save favorites', 'warning');
      return;
    }
    await addFavorite(gemstone._id);
    notify('Gemstone added to favorites');
  };

  return (
    <article className="gem-card">
      <img src={gemstone.image} alt={gemstone.name} />
      <div className="gem-card-body">
        <div className="card-title-row">
          <h3>{gemstone.name}</h3>
          <button className="icon-btn small" onClick={saveFavorite} aria-label={`Save ${gemstone.name}`}>
            <Heart size={16} />
          </button>
        </div>
        <p>{gemstone.description}</p>
        <div className="tag-row">
          <span>{gemstone.planet}</span>
          <span>{gemstone.color}</span>
        </div>
        <ul className="mini-list">
          {gemstone.benefits.slice(0, 3).map((benefit) => <li key={benefit}>{benefit}</li>)}
        </ul>
        <Link className="secondary-btn full" to={`/gemstone/${gemstone._id}`}>
          <Info size={16} /> View Details
        </Link>
      </div>
    </article>
  );
}
