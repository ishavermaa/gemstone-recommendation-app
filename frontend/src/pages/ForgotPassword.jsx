import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function ForgotPassword() {
  const { notify } = useNotifications();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setSubmitted(true);
      notify('If an account exists, a reset link has been sent to your email');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="auth-page">
        <div className="panel form-panel">
          <h1>Check Your Email</h1>
          <p style={{ marginBottom: '2rem' }}>
            If an account exists with this email, you will receive a password reset link. Please check your inbox and follow the instructions.
          </p>
          <Link to="/login" className="primary-btn full">
            Back to Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        {error && <p className="error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </label>
        <button className="primary-btn full" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <p style={{ textAlign: 'center' }}>
          <Link to="/login">Back to Login</Link>
        </p>
      </form>
    </section>
  );
}
