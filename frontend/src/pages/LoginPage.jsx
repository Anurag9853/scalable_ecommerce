import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-logo">BharatMart</span>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-5)' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Password
              <a href="#" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 500 }}>
                Forgot password?
              </a>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            style={{ justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="divider" style={{ position: 'relative', textAlign: 'center', margin: 'var(--space-6) 0' }}>
          <span style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'var(--color-surface)', padding: '0 var(--space-3)',
            fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', fontWeight: 500,
          }}>or continue with</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <button className="btn btn-secondary" style={{ justifyContent: 'center', gap: 6 }}>
            🌐 Google
          </button>
          <button className="btn btn-secondary" style={{ justifyContent: 'center', gap: 6 }}>
            📘 Facebook
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
