import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext.jsx';
import { getFavorites, removeFavorite } from '../services/favoriteService.js';

export default function Favorites() {
  const { notify } = useNotifications();
  const [favorites, setFavorites] = useState([]);

  const load = () => getFavorites().then(({ favorites }) => setFavorites(favorites));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    await removeFavorite(id);
    notify('Favorite removed');
    load();
  };

  return (
    <section className="section">
      <div className="section-heading"><p className="eyebrow">Favorites</p><h1>Saved gemstones</h1></div>
      <div className="grid cards">
        {favorites.map(({ _id, gemstoneId }) => (
          <article className="gem-card" key={_id}>
            <img src={gemstoneId.image} alt={gemstoneId.name} />
            <div className="gem-card-body">
              <h3>{gemstoneId.name}</h3>
              <p>{gemstoneId.description}</p>
              <div className="hero-actions">
                <Link className="secondary-btn" to={`/gemstone/${gemstoneId._id}`}>Details</Link>
                <button className="icon-btn" onClick={() => remove(_id)} aria-label="Remove favorite"><Trash2 size={16} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
