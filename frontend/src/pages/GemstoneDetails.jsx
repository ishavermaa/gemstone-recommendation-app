import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GemstoneCard from '../components/GemstoneCard.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import { addFavorite } from '../services/favoriteService.js';
import { getGemstone } from '../services/gemstoneService.js';

export default function GemstoneDetails() {
  const { id } = useParams();
  const { notify } = useNotifications();
  const [data, setData] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    getGemstone(id).then((nextData) => {
      setData(nextData);
      setActiveImage(nextData.gemstone.image);
    });
  }, [id]);

  if (!data) return <section className="section"><LoadingSkeleton count={1} /></section>;

  const { gemstone, related } = data;
  const images = [gemstone.image, ...(gemstone.gallery || [])];

  const save = async () => {
    await addFavorite(gemstone._id);
    notify('Gemstone added to favorites');
  };

  return (
    <section className="section">
      <div className="details-layout">
        <div className="gallery">
          <img src={activeImage} alt={gemstone.name} />
          {images.length > 1 && (
            <div className="thumbnail-row">
              {images.map((image) => (
                <button className={image === activeImage ? 'active' : ''} key={image} onClick={() => setActiveImage(image)} type="button">
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="details-copy">
          <p className="eyebrow">{gemstone.planet} - {gemstone.color}</p>
          <h1>{gemstone.name}</h1>
          <p>{gemstone.description}</p>
          <button className="primary-btn" onClick={save}><Heart size={16} /> Save Favorite</button>
          <div className="detail-grid">
            <div><strong>Benefits</strong><span>{gemstone.benefits.join(', ')}</span></div>
            <div><strong>Wearing method</strong><span>{gemstone.wearingInstructions}</span></div>
            <div><strong>Suggested metal</strong><span>{gemstone.suggestedMetal}</span></div>
            <div><strong>Recommended day</strong><span>{gemstone.suggestedDay}</span></div>
          </div>
        </div>
      </div>
      <div className="section-heading"><h2>Related gemstones</h2></div>
      <div className="grid cards">
        {related.map((item) => <GemstoneCard gemstone={item} key={item._id} />)}
      </div>
      <Link className="secondary-btn" to="/gemstones">Back to catalog</Link>
    </section>
  );
}
