import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext.jsx';
import { createRecommendation } from '../services/recommendationService.js';

const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const goals = ['Career Growth', 'Wealth', 'Education', 'Love', 'Confidence', 'Health', 'Peace of Mind'];

export default function RecommendationForm() {
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const [form, setForm] = useState({ name: '', gender: '', dateOfBirth: '', zodiacSign: '', profession: '', goal: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value) nextErrors[key] = 'Required';
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await createRecommendation(form);
      sessionStorage.setItem('latest_recommendation', JSON.stringify(data.recommendation));
      notify('New recommendation generated');
      navigate('/recommendation-result');
    } catch (err) {
      notify(err.response?.data?.message || 'Recommendation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section narrow">
      <form className="panel form-panel wide" onSubmit={submit}>
        <p className="eyebrow">Recommendation form</p>
        <h1>Tell us what you need</h1>
        <label>Full Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />{errors.name && <span>{errors.name}</span>}</label>
        <label>Gender<select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option value="">Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select>{errors.gender && <span>{errors.gender}</span>}</label>
        <label>Date of Birth<input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />{errors.dateOfBirth && <span>{errors.dateOfBirth}</span>}</label>
        <label>Zodiac Sign<select value={form.zodiacSign} onChange={(e) => setForm({ ...form, zodiacSign: e.target.value })}><option value="">Select</option>{zodiacSigns.map((item) => <option key={item}>{item}</option>)}</select>{errors.zodiacSign && <span>{errors.zodiacSign}</span>}</label>
        <label>Profession<input value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />{errors.profession && <span>{errors.profession}</span>}</label>
        <label>Goal<select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}><option value="">Select</option>{goals.map((item) => <option key={item}>{item}</option>)}</select>{errors.goal && <span>{errors.goal}</span>}</label>
        <button className="primary-btn full" disabled={loading}>{loading ? 'Generating...' : 'Generate Recommendation'}</button>
      </form>
    </section>
  );
}
