import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function ResetPassword() {
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Invalid reset link');
        setValidating(false);
        return;
      }

      try {
        const response = await fetch(`/api/password-reset/verify?token=${token}`);
        if (!response.ok) {
          setError('This reset link has expired or is invalid');
        }
      } catch (err) {
        setError('An error occurred. Please request a new reset link.');
      } finally {
        setValidating(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/password-reset/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setSuccess(true);
      notify('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <section className="auth-page">
        <div className="panel form-panel">
          <p>Verifying reset link...</p>
        </div>
      </section>
    );
  }

  if (error && !token) {
    return (
      <section className="auth-page">
        <div className="panel form-panel">
          <h1>Reset Password</h1>
          <p className="error" style={{ marginBottom: '2rem' }}>{error}</p>
          <Link to="/forgot-password" className="primary-btn full">
            Request New Link
          </Link>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="auth-page">
        <div className="panel form-panel">
          <h1>Password Reset Successful</h1>
          <p style={{ marginBottom: '2rem' }}>
            Your password has been reset successfully. Redirecting to login page...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        {error && <p className="error">{error}</p>}

        <label>
          New Password
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="Enter new password"
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
              placeholder="Confirm new password"
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
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </section>
  );
}
