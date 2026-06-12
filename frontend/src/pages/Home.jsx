import { ArrowRight, BadgeCheck, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const featured = ['Ruby', 'Emerald', 'Yellow Sapphire'];
const faqs = [
  ['Is this medical or astrological advice?', 'No. The app provides educational, preference-based recommendations and should not replace expert guidance.'],
  ['Can I save recommendations?', 'Registered users can save history and favorites in their dashboard.'],
  ['Can admins manage content?', 'Admins can create, update, and remove gemstone catalog records through protected APIs.']
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Personalized gemstone discovery</p>
          <h1>Find gemstones aligned with your goals, profile, and preferences.</h1>
          <p>Explore a curated gemstone catalog, answer a focused recommendation form, and track your personalized results from a responsive dashboard.</p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/recommend">Get Recommendation <ArrowRight size={18} /></Link>
            <Link className="secondary-btn" to="/gemstones">Browse Catalog</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Featured gemstones</p>
          <h2>Start with trusted classics</h2>
        </div>
        <div className="feature-strip">
          {featured.map((name) => <div className="feature-pill" key={name}><Sparkles size={18} /> {name}</div>)}
        </div>
      </section>

      <section className="section grid three">
        <div className="info-card"><BadgeCheck /><h3>Rule-based matching</h3><p>Recommendations consider goal, zodiac association, profession signals, and benefits.</p></div>
        <div className="info-card"><HeartHandshake /><h3>Saved journeys</h3><p>Users can save gemstones, keep recommendation history, and review recent activity.</p></div>
        <div className="info-card"><ShieldCheck /><h3>Admin control</h3><p>RBAC-protected APIs support gemstone management, users, and analytics.</p></div>
      </section>

      <section className="section split">
        <div>
          <p className="eyebrow">How it works</p>
          <h2>Answer, match, save</h2>
          <ol className="steps">
            <li>Complete the recommendation form.</li>
            <li>Review match score, benefits, planet, metal, and wearing day.</li>
            <li>Save favorites and revisit history from the dashboard.</li>
          </ol>
        </div>
        <div className="testimonial">
          <p>"The dashboard makes gemstone discovery feel practical and organized."</p>
          <strong>Priya S.</strong>
        </div>
      </section>

      <section className="section">
        <div className="section-heading"><p className="eyebrow">FAQ</p><h2>Common questions</h2></div>
        <div className="faq-list">
          {faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </section>
    </>
  );
}
