import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function Login() {
  const { login, loading } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const user = await login(form);
      notify(`Welcome back, ${user.name}`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="auth-page">
      <form className="panel form-panel" onSubmit={submit}>
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
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
        <button className="primary-btn full" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          <Link to="/forgot-password" style={{ marginRight: '1rem' }}>Forgot Password?</Link>
        </div>
        <p>New here? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  );
}
