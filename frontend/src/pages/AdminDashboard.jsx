import { Edit3, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BarChart, Bar, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from 'recharts';
import { useNotifications } from '../context/NotificationContext.jsx';
import { getAnalytics, getUsers } from '../services/adminService.js';
import { createGemstone, deleteGemstone, getGemstones, updateGemstone } from '../services/gemstoneService.js';

const colors = ['#0f766e', '#b45309', '#be123c', '#4338ca', '#047857'];
const emptyForm = {
  name: '',
  image: '',
  description: '',
  benefits: '',
  color: '',
  planet: '',
  recommendedFor: '',
  wearingInstructions: '',
  suggestedMetal: '',
  suggestedDay: ''
};

const toText = (value) => Array.isArray(value) ? value.join(', ') : value || '';
const toList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);

const toForm = (gemstone) => ({
  name: gemstone.name,
  image: gemstone.image,
  description: gemstone.description,
  benefits: toText(gemstone.benefits),
  color: gemstone.color,
  planet: gemstone.planet,
  recommendedFor: toText(gemstone.recommendedFor),
  wearingInstructions: gemstone.wearingInstructions,
  suggestedMetal: gemstone.suggestedMetal || '',
  suggestedDay: gemstone.suggestedDay || ''
});

const toPayload = (form) => ({
  ...form,
  benefits: toList(form.benefits),
  recommendedFor: toList(form.recommendedFor)
});

export default function AdminDashboard() {
  const { notify } = useNotifications();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [gemstones, setGemstones] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadAdminData = () => {
    Promise.all([getAnalytics(), getUsers(), getGemstones()]).then(([analyticsData, userData, gemstoneData]) => {
      setAnalytics(analyticsData);
      setUsers(userData.users);
      setGemstones(gemstoneData.gemstones);
    });
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  if (!analytics) return <section className="section"><div className="panel">Loading analytics...</div></section>;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const editGemstone = (gemstone) => {
    setEditingId(gemstone._id);
    setForm(toForm(gemstone));
  };

  const submitGemstone = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) await updateGemstone(editingId, toPayload(form));
      else await createGemstone(toPayload(form));
      notify(editingId ? 'Gemstone updated' : 'Gemstone created');
      resetForm();
      loadAdminData();
    } catch (err) {
      notify(err.response?.data?.message || 'Gemstone save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeGemstone = async (id) => {
    if (!window.confirm('Delete this gemstone?')) return;
    try {
      await deleteGemstone(id);
      notify('Gemstone deleted');
      loadAdminData();
    } catch (err) {
      notify(err.response?.data?.message || 'Gemstone delete failed', 'error');
    }
  };

  return (
    <section className="section">
      <div className="section-heading"><p className="eyebrow">Admin</p><h1>Platform analytics</h1></div>
      <div className="grid four stats">
        {Object.entries(analytics.totals).map(([key, value]) => <div className="stat" key={key}><strong>{value}</strong><span>{key}</span></div>)}
      </div>
      <div className="two-col">
        <div className="panel chart-panel">
          <h2>Goal distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={analytics.goals} dataKey="value" nameKey="name" outerRadius={90}>
                {analytics.goals.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="panel chart-panel">
          <h2>Most recommended</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.mostRecommended}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="panel chart-panel">
        <h2>Monthly growth</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={analytics.monthlyGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="recommendations" stroke="#be123c" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="panel">
        <h2>Users</h2>
        <div className="activity-list">
          {users.map((user) => <div key={user._id}><strong>{user.name}</strong><span>{user.email} - {user.role}</span></div>)}
        </div>
      </div>
      <div className="section-heading admin-heading">
        <p className="eyebrow">Catalog management</p>
        <h2>Manage gemstones</h2>
      </div>
      <form className="panel admin-form" onSubmit={submitGemstone}>
        <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label>Image URL<input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required /></label>
        <label>Color<input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required /></label>
        <label>Planet<input value={form.planet} onChange={(e) => setForm({ ...form, planet: e.target.value })} required /></label>
        <label>Benefits<input value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder="Focus, Wealth, Confidence" required /></label>
        <label>Recommended for<input value={form.recommendedFor} onChange={(e) => setForm({ ...form, recommendedFor: e.target.value })} placeholder="Career Growth, Education" /></label>
        <label>Suggested metal<input value={form.suggestedMetal} onChange={(e) => setForm({ ...form, suggestedMetal: e.target.value })} /></label>
        <label>Suggested day<input value={form.suggestedDay} onChange={(e) => setForm({ ...form, suggestedDay: e.target.value })} /></label>
        <label className="full-row">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
        <label className="full-row">Wearing instructions<textarea value={form.wearingInstructions} onChange={(e) => setForm({ ...form, wearingInstructions: e.target.value })} required /></label>
        <div className="form-actions full-row">
          <button className="primary-btn" disabled={saving}>{editingId ? <Save size={16} /> : <Plus size={16} />} {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add gemstone'}</button>
          {editingId && <button className="secondary-btn" type="button" onClick={resetForm}><X size={16} /> Cancel</button>}
        </div>
      </form>
      <div className="admin-table panel">
        {gemstones.map((gemstone) => (
          <div className="admin-row" key={gemstone._id}>
            <img src={gemstone.image} alt={gemstone.name} />
            <div>
              <strong>{gemstone.name}</strong>
              <span>{gemstone.planet} - {gemstone.color}</span>
            </div>
            <div className="row-actions">
              <button className="icon-btn" onClick={() => editGemstone(gemstone)} aria-label={`Edit ${gemstone.name}`}><Edit3 size={16} /></button>
              <button className="icon-btn danger" onClick={() => removeGemstone(gemstone._id)} aria-label={`Delete ${gemstone.name}`}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
