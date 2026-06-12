import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import api from '../services/api.js';

export default function Profile() {
  const { user, token, loading, updateProfile } = useAuth();
  const { notify } = useNotifications();
  const [form, setForm] = useState({ name: '', email: '', age: '', dateOfBirth: '', profileImage: '' });
  const [errors, setErrors] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [stats, setStats] = useState({ totalRecommendations: 0, totalFavorites: 0 });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        age: user.age || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        profileImage: user.profileImage || '',
      });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const data = await api.get('/profile');
      setStats({
        totalRecommendations: data.data.totalRecommendations || 0,
        totalFavorites: data.data.totalFavorites || 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Required';
    if (!form.email.trim()) nextErrors.email = 'Required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        age: form.age,
        dateOfBirth: form.dateOfBirth,
        profileImage: form.profileImage,
      });
      notify('Profile updated');
    } catch (err) {
      notify(err.response?.data?.message || 'Profile update failed', 'error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notify('Passwords do not match', 'error');
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      notify('Password must be at least 6 characters', 'error');
      setPasswordLoading(false);
      return;
    }

    try {
      await api.post('/profile/change-password', passwordForm);
      setChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      notify('Password changed successfully');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <section className="section narrow">
      <div className="panel form-panel">
        <p className="eyebrow">Profile</p>
        <h1>Manage profile</h1>

        <form onSubmit={submit}>
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <span>{errors.name}</span>}
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <span>{errors.email}</span>}
          </label>
          <label>
            Age
            <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </label>
          <label>
            Date of Birth
            <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          </label>
          <label>
            Profile Image URL
            <input value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} placeholder="Enter image URL" />
          </label>

          <div className="detail-grid">
            <div><strong>Role</strong><span>{user?.role}</span></div>
            <div><strong>Member since</strong><span>{user && new Date(user.createdAt).toLocaleDateString()}</span></div>
          </div>

          <button className="primary-btn full" disabled={loading}>
            <Save size={16} /> {loading ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </div>

      <div className="panel form-panel" style={{ marginTop: '2rem' }}>
        <h2>Statistics</h2>
        <div className="detail-grid">
          <div><strong>Total Recommendations</strong><span>{stats.totalRecommendations}</span></div>
          <div><strong>Total Favorites</strong><span>{stats.totalFavorites}</span></div>
        </div>
      </div>

      <div className="panel form-panel" style={{ marginTop: '2rem' }}>
        <h2>Security</h2>
        {!changingPassword ? (
          <button onClick={() => setChangingPassword(true)} className="primary-btn">
            Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordChange}>
            <label>
              Current Password
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
            </label>
            <label>
              New Password
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
            <label>
              Confirm New Password
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="primary-btn" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
              <button
                type="button"
                onClick={() => setChangingPassword(false)}
                style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
