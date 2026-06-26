import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Store, AlertCircle, ArrowRight, Loader2, Wallet, Zap, BarChart3, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthPage.css';

const PERKS = [
  { Icon: Wallet,    text: 'Digital stamp cards in Apple & Google Wallet' },
  { Icon: Zap,       text: 'Live in under 5 minutes — no app needed' },
  { Icon: BarChart3, text: 'Real-time customer analytics dashboard' },
  { Icon: Gift,      text: 'Automated rewards when stamps complete' },
];

export default function AuthPage({ mode }) {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const isSignup    = mode === 'signup';

  const [form, setForm]         = useState({ cafeName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  function change(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); }

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
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

      {/* ── Left panel ── */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <Link to="/" className="auth-brand">
            <img src="/decidr-logo.png" alt="decidr" className="auth-brand-img" />
            <span className="auth-brand-badge">loyalty</span>
          </Link>

          <div className="auth-left-body">
            <h2 className="auth-left-headline">
              Turn every purchase into a reason to come back.
            </h2>
            <p className="auth-left-sub">
              The loyalty platform built for independent cafes and local businesses.
            </p>
            <ul className="auth-perks">
              {PERKS.map(({ Icon, text }) => (
                <li key={text} className="auth-perk">
                  <span className="auth-perk-icon">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="auth-left-footer">
            <p className="auth-testimonial-text">"We went from paper cards to digital in one afternoon. Customers love it."</p>
            <p className="auth-testimonial-author">— Cafe owner, Lahore</p>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">

        {/* Mobile gradient header (hidden on desktop) */}
        <div className="auth-mobile-header">
          <Link to="/" className="auth-mobile-brand">
            <img src="/decidr-logo.png" alt="decidr" className="auth-mobile-logo" />
            <span className="auth-brand-badge">loyalty</span>
          </Link>
        </div>

        <div className="auth-card">

          <h1 className="auth-title">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="auth-sub">
            {isSignup
              ? 'Set up your cafe loyalty program in minutes.'
              : 'Sign in to your loyalty dashboard.'}
          </p>

          <form onSubmit={submit} className="auth-form">

            {isSignup && (
              <div className="auth-field">
                <label className="auth-label">Cafe / Business Name</label>
                <div className="auth-input-wrap">
                  <Store size={16} className="auth-icon" />
                  <input
                    className="auth-input"
                    name="cafeName" type="text"
                    placeholder="e.g. Brew & Co."
                    value={form.cafeName}
                    onChange={change}
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-icon" />
                <input
                  className="auth-input"
                  name="email" type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={change}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-icon" />
                <input
                  className="auth-input auth-input--password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder={isSignup ? 'At least 8 characters' : '••••••••'}
                  value={form.password}
                  onChange={change}
                  required
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPass(s => !s)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading
                ? <Loader2 size={18} className="auth-spin" />
                : <>
                    {isSignup ? 'Create account' : 'Sign in'}
                    <ArrowRight size={16} />
                  </>
              }
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-switch">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <Link to={isSignup ? '/login' : '/signup'} className="auth-switch-link">
              {isSignup ? 'Log in' : 'Start for free'}
            </Link>
          </p>

          <p className="auth-terms">
            By continuing you agree to our{' '}
            <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
