import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './StampPage.css';

const API = 'https://trydecidr.xyz/api/loyalty';

const STATES = { LOADING: 'loading', ENTER: 'enter', STAMPED: 'stamped', REWARD: 'reward', ERROR: 'error' };

export default function StampPage() {
  const { slug }            = useParams();
  const [program, setProgram] = useState(null);
  const [view, setView]     = useState(STATES.LOADING);
  const [phone, setPhone]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError]   = useState('');
  const inputRef = useRef(null);

  const isNumericId = /^\d+$/.test(slug);
  const programParam = isNumericId ? `restaurantId=${slug}` : `slug=${slug}`;

  // Load program branding
  useEffect(() => {
    if (!slug) { setView(STATES.ERROR); return; }
    fetch(`${API}?action=program&${programParam}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.program) {
          setProgram(data.program);
          setView(STATES.ENTER);
        } else {
          setView(STATES.ERROR);
        }
      })
      .catch(() => setView(STATES.ERROR));
  }, [slug, programParam]);

  useEffect(() => {
    if (view === STATES.ENTER) setTimeout(() => inputRef.current?.focus(), 200);
  }, [view]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!phone.trim()) return;
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API}?action=stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isNumericId ? { restaurantId: slug } : { slug }),
          phone: phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
      setView(data.rewarded ? STATES.REWARD : STATES.STAMPED);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function stampAgain() {
    setPhone(''); setResult(null); setError('');
    setView(STATES.ENTER);
  }

  const color   = program?.primaryColor || '#ff0000';
  const stamps  = program?.stampsRequired || 9;
  const reward  = program?.rewardName || 'Free Reward';
  const current = result?.stampCount ?? 0;

  /* ── Loading ── */
  if (view === STATES.LOADING) {
    return (
      <div className="sp-loading">
        <div className="sp-spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  /* ── Error ── */
  if (view === STATES.ERROR) {
    return (
      <div className="sp-error">
        <div className="sp-error-icon">😕</div>
        <h2>Program not found</h2>
        <p>This loyalty program doesn't exist or has been deactivated.</p>
      </div>
    );
  }

  /* ── Reward earned ── */
  if (view === STATES.REWARD) {
    return (
      <div className="sp sp-reward-view" style={{ '--brand': color }}>
        <div className="sp-reward-card">
          <div className="sp-reward-emoji">🎉</div>
          <h1 className="sp-reward-title">You earned it!</h1>
          <p className="sp-reward-sub">
            Show this screen to the cashier to claim your <strong>{reward}</strong>.
          </p>
          <div className="sp-reward-badge" style={{ background: color }}>
            🎁 {reward}
          </div>
          <p className="sp-reward-note">
            {result?.customer?.name ? `Well done, ${result.customer.name}!` : 'Well done!'} Your stamps have been reset and you're ready to collect again.
          </p>
          <button className="sp-btn" style={{ background: color }} onClick={stampAgain}>
            Start Again
          </button>
        </div>
        <div className="sp-reward-confetti">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className="sp-confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                background: i % 3 === 0 ? color : i % 3 === 1 ? '#fff' : '#f59e0b',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ── Stamped (success, not yet reward) ── */
  if (view === STATES.STAMPED) {
    const remaining = stamps - current;
    return (
      <div className="sp" style={{ '--brand': color }}>
        <div className="sp-header" style={{ background: color }}>
          {program.logoUrl
            ? <img src={program.logoUrl} alt={program.name} className="sp-logo" />
            : <p className="sp-cafe-name">{program.name || 'Loyalty Card'}</p>
          }
        </div>

        <div className="sp-body">
          <div className="sp-success-icon">✓</div>
          <h2 className="sp-stamped-title">Stamp added!</h2>
          <p className="sp-stamped-sub">
            {result?.customer?.name
              ? `Hi ${result.customer.name}! `
              : ''}
            {remaining > 0
              ? <><strong>{remaining} more stamp{remaining !== 1 ? 's' : ''}</strong> until your {reward}.</>
              : <>You're just one visit away from your {reward}!</>}
          </p>

          {/* Stamp dots */}
          <div className="sp-dots-wrap">
            <div className="sp-dots">
              {Array.from({ length: stamps }, (_, i) => (
                <span
                  key={i}
                  className={`sp-dot${i < current ? ' filled' : ''}`}
                  style={i < current ? { background: color, borderColor: color, boxShadow: `0 2px 8px ${color}55` } : {}}
                >
                  {i < current && <span className="sp-dot-check">✓</span>}
                </span>
              ))}
            </div>
            <p className="sp-dots-label">{current} / {stamps} stamps collected</p>
          </div>

          <div className="sp-reward-info" style={{ borderColor: color + '33', background: color + '08' }}>
            <span style={{ color }}>🎁</span>
            <span>Reward: <strong>{reward}</strong></span>
          </div>

          <button className="sp-btn" style={{ background: color }} onClick={stampAgain}>
            Done
          </button>
        </div>
      </div>
    );
  }

  /* ── Enter phone ── */
  return (
    <div className="sp" style={{ '--brand': color }}>
      {/* Branded header */}
      <div className="sp-header" style={{ background: color }}>
        {program.logoUrl
          ? <img src={program.logoUrl} alt={program.name} className="sp-logo" />
          : <p className="sp-cafe-name">{program.name || 'Loyalty Card'}</p>
        }
        <p className="sp-header-sub">Digital Loyalty Card</p>
      </div>

      <div className="sp-body">
        <h2 className="sp-title">Collect your stamp</h2>
        <p className="sp-sub">Enter your phone number to add a stamp to your loyalty card.</p>

        {/* Stamp preview */}
        <div className="sp-dots-wrap">
          <div className="sp-dots">
            {Array.from({ length: stamps }, (_, i) => (
              <span key={i} className="sp-dot sp-dot-preview"
                style={{ borderColor: color + '55' }} />
            ))}
          </div>
          <p className="sp-dots-label">Collect {stamps} stamps → earn {reward}</p>
        </div>

        <form className="sp-form" onSubmit={handleSubmit}>
          <label className="sp-label">Your phone number</label>
          <input
            ref={inputRef}
            className="sp-input"
            type="tel"
            inputMode="numeric"
            placeholder="03XX XXXXXXX"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            autoComplete="tel"
            style={{ '--focus-color': color }}
          />
          {error && <p className="sp-error-msg">{error}</p>}
          <button
            className="sp-btn"
            type="submit"
            disabled={submitting || !phone.trim()}
            style={{ background: color }}
          >
            {submitting ? 'Adding stamp…' : '＋ Get My Stamp'}
          </button>
        </form>

        <p className="sp-privacy">
          Your number is only used for your loyalty card. No spam, ever.
        </p>
      </div>

      <div className="sp-footer">
        <p>Powered by <strong>decidr loyalty</strong></p>
      </div>
    </div>
  );
}
