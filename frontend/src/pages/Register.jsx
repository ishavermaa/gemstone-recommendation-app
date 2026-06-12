import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function Register() {
  const { register, loading } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    // Validation
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!form.dateOfBirth) {
      setError('Date of birth is required');
      return;
    }
    if (!form.age || form.age < 18 || form.age > 120) {
      setError('Age must be between 18 and 120');
      return;
    }

    try {
      await register(form);
      notify('Account created');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="auth-page">
      <form className="panel form-panel" onSubmit={submit}>
        <h1>Create Account</h1>
        {error && <p className="error">{error}</p>}

        <label>
          Full Name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter your full name"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your email"
            required
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            Age
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="Your age"
              min="18"
              max="120"
              required
            />
          </label>

          <label>
            Date of Birth
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              required
            />
          </label>
        </div>

        <label>
          Role
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label>
          Password
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <label>
          Confirm Password
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <button className="primary-btn full" disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </section>
  );
}
