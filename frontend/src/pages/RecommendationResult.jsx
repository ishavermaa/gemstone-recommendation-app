import jsPDF from 'jspdf';
import { Download, Heart, Share2 } from 'lucide-react';
import { useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext.jsx';
import { addFavorite } from '../services/favoriteService.js';

export default function RecommendationResult() {
  const { notify } = useNotifications();
  const recommendation = useMemo(() => {
    const stored = sessionStorage.getItem('latest_recommendation');
    return stored ? JSON.parse(stored) : null;
  }, []);

  if (!recommendation) return <Navigate to="/recommend" replace />;

  const gemstone = recommendation.gemstoneId;

  const share = async () => {
    const text = `My gemstone recommendation is ${gemstone.name} with a ${recommendation.matchScore}% match.`;
    if (navigator.share) await navigator.share({ title: 'Gemstone Recommendation', text });
    else await navigator.clipboard.writeText(text);
    notify('Recommendation ready to share');
  };

  const download = () => {
    const pdf = new jsPDF();
    pdf.text('Gemstone Recommendation', 16, 18);
    pdf.text(`Gemstone: ${gemstone.name}`, 16, 32);
    pdf.text(`Match: ${recommendation.matchScore}%`, 16, 42);
    pdf.text(`Reason: ${recommendation.recommendationReason}`, 16, 52, { maxWidth: 170 });
    pdf.text(`Benefits: ${gemstone.benefits.join(', ')}`, 16, 76, { maxWidth: 170 });
    pdf.text(`Wearing: ${gemstone.wearingInstructions}`, 16, 96, { maxWidth: 170 });
    pdf.save(`${gemstone.name}-recommendation.pdf`);
  };

  const saveFavorite = async () => {
    await addFavorite(gemstone._id);
    notify('Gemstone saved to favorites');
  };

  return (
    <section className="section">
      <div className="result-panel">
        <img src={gemstone.image} alt={gemstone.name} />
        <div>
          <p className="eyebrow">Recommendation result</p>
          <h1>{gemstone.name}</h1>
          <p>{gemstone.description}</p>
          <div className="score">{recommendation.matchScore}% match</div>
          <div className="saved-note">Saved to your recommendation history</div>
          <p>{recommendation.recommendationReason}</p>
          <div className="detail-grid">
            <div><strong>Benefits</strong><span>{gemstone.benefits.join(', ')}</span></div>
            <div><strong>Planet</strong><span>{gemstone.planet}</span></div>
            <div><strong>Color</strong><span>{gemstone.color}</span></div>
            <div><strong>Wearing method</strong><span>{gemstone.wearingInstructions}</span></div>
            <div><strong>Metal</strong><span>{gemstone.suggestedMetal}</span></div>
            <div><strong>Day</strong><span>{gemstone.suggestedDay}</span></div>
          </div>
          <div className="hero-actions">
            <button className="primary-btn" onClick={saveFavorite}><Heart size={16} /> Save Favorite</button>
            <button className="primary-btn" onClick={share}><Share2 size={16} /> Share</button>
            <button className="secondary-btn" onClick={download}><Download size={16} /> Download PDF</button>
            <Link className="ghost-btn" to="/dashboard">View Dashboard</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
