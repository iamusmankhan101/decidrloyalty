import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthPage.css';

export default function AuthPage({ mode }) {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const isSignup  = mode === 'signup';

  const [form, setForm]     = useState({ cafeName: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function change(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const body = isSignup
        ? { action: 'register', email: form.email, password: form.password, restaurantName: form.cafeName, role: 'restaurant' }
        : { action: 'login',    email: form.email, password: form.password };

      const res  = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      login(data.token, data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">decidr <span className="auth-logo-badge">loyalty</span></Link>

        <h1 className="auth-title">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-sub">
          {isSignup ? 'Set up your cafe loyalty program in minutes.' : 'Log in to your loyalty dashboard.'}
        </p>

        <form onSubmit={submit} className="auth-form">
          {isSignup && (
            <div className="auth-field">
              <label className="auth-label">Cafe Name</label>
              <input className="auth-input" name="cafeName" type="text" placeholder="e.g. Brew & Co." value={form.cafeName} onChange={change} required />
            </div>
          )}
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={change} required />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" name="password" type="password" placeholder={isSignup ? 'At least 8 characters' : '••••••••'} value={form.password} onChange={change} required />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? '...' : isSignup ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <Link to={isSignup ? '/login' : '/signup'} className="auth-switch-link">
            {isSignup ? 'Log in' : 'Sign up free'}
          </Link>
        </p>
      </div>
    </div>
  );
}
