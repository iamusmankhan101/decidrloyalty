import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Store, AlertCircle, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthPage.css';

const CARD_TYPES = [
  { id: 'stamp',        emoji: '☕', name: 'Stamp Card',      desc: 'Collect stamps, earn free rewards',     live: true  },
  { id: 'cashback',     emoji: '💰', name: 'Cashback Card',   desc: 'Earn Rs. back on every visit',          live: true  },
  { id: 'punch',        emoji: '👊', name: 'Punch Card',      desc: 'Digital punch-based reward tracking',   live: false },
  { id: 'membership',   emoji: '🏅', name: 'Membership',      desc: 'Monthly or yearly member benefits',     live: false },
  { id: 'subscription', emoji: '🔔', name: 'Subscription',    desc: 'Recurring service subscriptions',       live: false },
  { id: 'coupon',       emoji: '🏷️',  name: 'Coupons',         desc: 'Issue and track discount coupons',      live: false },
  { id: 'event',        emoji: '🎫', name: 'Event Pass',      desc: 'Ticketing and event access cards',      live: false },
  { id: 'gift',         emoji: '🎁', name: 'Gift Card',       desc: 'Prepaid digital gift cards',            live: false },
];

export default function AuthPage({ mode }) {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const isSignup  = mode === 'signup';

  // step: 'pick' (card type) | 'form' (credentials)
  const [step, setStep]         = useState(isSignup ? 'pick' : 'form');
  const [cardType, setCardType] = useState('');
  const [form, setForm]         = useState({ businessName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  function change(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); }

  function selectType(type) {
    if (!type.live) return;
    setCardType(type.id);
  }

  function continueToForm() {
    if (!cardType) return;
    setStep('form');
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const body = isSignup
        ? { action: 'register', email: form.email, password: form.password, restaurantName: form.businessName, role: 'restaurant', cardType }
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

  const selectedType = CARD_TYPES.find(t => t.id === cardType);

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
              {selectedType
                ? `${selectedType.emoji} ${selectedType.name}`
                : 'Turn every visit into a reason to come back.'}
            </h2>
            <p className="auth-left-sub">
              {selectedType
                ? selectedType.desc
                : 'Choose a loyalty card type and go live in minutes — no app needed.'}
            </p>

            {/* Card type preview dots */}
            {isSignup && step === 'pick' && (
              <div className="auth-type-dots">
                {CARD_TYPES.map(t => (
                  <span
                    key={t.id}
                    className={`auth-type-dot${t.id === cardType ? ' active' : ''}${!t.live ? ' soon' : ''}`}
                    title={t.name}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="auth-left-footer">
            <p className="auth-testimonial-text">"We went from paper cards to digital in one afternoon. Customers love it."</p>
            <p className="auth-testimonial-author">— Business owner, Lahore</p>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">

        <div className="auth-mobile-header">
          <Link to="/" className="auth-mobile-brand">
            <img src="/decidr-logo.png" alt="decidr" className="auth-mobile-logo" />
            <span className="auth-brand-badge">loyalty</span>
          </Link>
        </div>

        {/* ── Step 1: Card type picker ── */}
        {step === 'pick' && (
          <div className="auth-card auth-card--wide">
            <h1 className="auth-title">Choose your card type</h1>
            <p className="auth-sub">Pick the loyalty format that fits your business.</p>

            <div className="auth-type-grid">
              {CARD_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  disabled={!type.live}
                  onClick={() => selectType(type)}
                  className={`auth-type-card${cardType === type.id ? ' selected' : ''}${!type.live ? ' disabled' : ''}`}
                >
                  <span className="auth-type-emoji">{type.emoji}</span>
                  <span className="auth-type-name">{type.name}</span>
                  <span className="auth-type-desc">{type.desc}</span>
                  {!type.live && <span className="auth-type-soon">Soon</span>}
                  {type.live && cardType === type.id && <span className="auth-type-check">✓</span>}
                </button>
              ))}
            </div>

            <button
              className="auth-btn"
              onClick={continueToForm}
              disabled={!cardType}
              style={{ marginTop: '1.5rem' }}
            >
              Continue <ArrowRight size={16} />
            </button>

            <p className="auth-switch" style={{ marginTop: '1.25rem' }}>
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">Log in</Link>
            </p>
          </div>
        )}

        {/* ── Step 2: Signup / Login form ── */}
        {step === 'form' && (
          <div className="auth-card">

            {isSignup && (
              <button className="auth-back" onClick={() => setStep('pick')}>
                <ArrowLeft size={15} /> {selectedType?.emoji} {selectedType?.name}
              </button>
            )}

            <h1 className="auth-title">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="auth-sub">
              {isSignup ? 'Almost there — fill in your details.' : 'Sign in to your loyalty dashboard.'}
            </p>

            <form onSubmit={submit} className="auth-form">
              {isSignup && (
                <div className="auth-field">
                  <label className="auth-label">Business Name</label>
                  <div className="auth-input-wrap">
                    <Store size={16} className="auth-icon" />
                    <input
                      className="auth-input"
                      name="businessName" type="text"
                      placeholder="e.g. Glamour Salon"
                      value={form.businessName}
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
                  <button type="button" className="auth-eye" onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                    {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
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
                  : <>{isSignup ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></>
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
        )}
      </div>
    </div>
  );
}
