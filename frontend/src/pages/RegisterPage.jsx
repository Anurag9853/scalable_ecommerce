import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      const from = location.state?.from
        ? (typeof location.state.from === 'string'
            ? location.state.from
            : (location.state.from.pathname + (location.state.from.search || ''))
          )
        : '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const strength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ff453a', '#ff9500', '#30d158', '#30d158'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/register', { name, email, password });
      login(data.user, data.token);
      const from = location.state?.from
        ? (typeof location.state.from === 'string'
            ? location.state.from
            : (location.state.from.pathname + (location.state.from.search || ''))
          )
        : '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-logo">BharatMart</span>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join millions of happy shoppers</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-5)' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                className="form-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-tertiary)', fontSize: 16,
                }}
                onClick={() => setShowPwd((s) => !s)}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            {/* Strength meter */}
            {password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4].map((i) => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: i <= strength ? strengthColor : 'var(--color-border)',
                      transition: 'background 0.3s ease',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 'var(--font-size-xs)', color: strengthColor, fontWeight: 500 }}>
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-input ${confirm && confirm !== password ? 'error' : ''}`}
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
            {confirm && confirm !== password && (
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', marginTop: 4, display: 'block' }}>
                Passwords don't match
              </span>
            )}
          </div>

          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-5)', lineHeight: 1.5 }}>
            By creating an account, you agree to our{' '}
            <a href="#" style={{ color: 'var(--color-primary)' }}>Terms of Service</a> and{' '}
            <a href="#" style={{ color: 'var(--color-primary)' }}>Privacy Policy</a>.
          </p>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            style={{ justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? '⏳ Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-5)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
