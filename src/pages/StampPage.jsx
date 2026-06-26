import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './StampPage.css';

const API = '/api/loyalty';

const STATES = { LOADING: 'loading', ENTER: 'enter', STAMPED: 'stamped', REWARD: 'reward', ERROR: 'error' };

const isIOS     = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isAndroid = /android/i.test(navigator.userAgent);

function WalletSheet({ walletUrl, applePassUrl, onDismiss }) {
  if (!walletUrl && !applePassUrl) return null;

  return (
    <div className="sp-sheet-backdrop" onClick={onDismiss}>
      <div className="sp-sheet" onClick={e => e.stopPropagation()}>
        <div className="sp-sheet-handle" />
        <p className="sp-sheet-title">Save your loyalty card</p>
        <p className="sp-sheet-sub">Add it to your wallet so you always have it handy.</p>

        {/* Google Wallet — show on Android, or on non-iOS desktop */}
        {walletUrl && !isIOS && (
          <a href={walletUrl} target="_blank" rel="noopener noreferrer" className="sp-wallet-btn sp-gwallet-btn">
            <svg className="sp-wallet-icon" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#4285F4"/>
              <path d="M20 4H4C2.9 4 2 4.9 2 6v2h20V6c0-1.1-.9-2-2-2z" fill="#1A73E8"/>
              <circle cx="16" cy="14" r="3" fill="#FBBC04"/>
              <path d="M16 11v6M13 14h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add to Google Wallet
          </a>
        )}

        {/* Apple Wallet — show only on iOS */}
        {isIOS && applePassUrl && (
          <a href={applePassUrl} className="sp-wallet-btn sp-awallet-btn">
            <svg className="sp-wallet-icon" viewBox="0 0 24 24" fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Add to Apple Wallet
          </a>
        )}

        {/* Fallback: show Google Wallet on iOS if no apple pass */}
        {isIOS && !applePassUrl && walletUrl && (
          <a href={walletUrl} target="_blank" rel="noopener noreferrer" className="sp-wallet-btn sp-gwallet-btn">
            <svg className="sp-wallet-icon" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#4285F4"/>
              <path d="M20 4H4C2.9 4 2 4.9 2 6v2h20V6c0-1.1-.9-2-2-2z" fill="#1A73E8"/>
              <circle cx="16" cy="14" r="3" fill="#FBBC04"/>
              <path d="M16 11v6M13 14h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add to Google Wallet
          </a>
        )}

        <button className="sp-sheet-dismiss" onClick={onDismiss}>Not now</button>
      </div>
    </div>
  );
}

export default function StampPage() {
  const { slug }            = useParams();
  const [program, setProgram] = useState(null);
  const [view, setView]     = useState(STATES.LOADING);
  const [phone, setPhone]   = useState('');
  const [name, setName]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError]   = useState('');
  const [isReturning, setIsReturning] = useState(null); // null=unknown true=returning false=new
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [showWalletSheet, setShowWalletSheet] = useState(false);
  const [pin, setPin] = useState('');
  const inputRef    = useRef(null);
  const phoneCheckRef = useRef(null);

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

  function handlePhoneChange(e) {
    const val = e.target.value;
    setPhone(val);
    setIsReturning(null);
    clearTimeout(phoneCheckRef.current);
    const cleaned = val.replace(/\s+/g, '');
    if (cleaned.length >= 10) {
      setCheckingPhone(true);
      phoneCheckRef.current = setTimeout(async () => {
        try {
          const r = await fetch(`${API}?action=card&phone=${encodeURIComponent(val.trim())}&${programParam}`);
          const d = await r.json();
          setIsReturning(d.card ? true : false);
        } catch {
          setIsReturning(false);
        } finally {
          setCheckingPhone(false);
        }
      }, 600);
    } else {
      setCheckingPhone(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!phone.trim()) return;
    if (isReturning === false && !name.trim()) {
      setError('Please enter your name — it\'s required for your first visit.');
      return;
    }
    if (program?.staffPin && !pin.trim()) {
      setError('Staff PIN is required to add a stamp.');
      return;
    }
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API}?action=stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isNumericId ? { restaurantId: slug } : { slug }),
          phone: phone.trim(),
          name: name.trim(),
          staffPin: pin,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
      setView(data.rewarded ? STATES.REWARD : STATES.STAMPED);
      if (data.walletUrl || data.applePassUrl) {
        setTimeout(() => setShowWalletSheet(true), 800);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function stampAgain() {
    setPhone(''); setName(''); setResult(null); setError('');
    setIsReturning(null); setCheckingPhone(false); setShowWalletSheet(false); setPin('');
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
        {showWalletSheet && (
          <WalletSheet
            walletUrl={result?.walletUrl}
            applePassUrl={result?.applePassUrl}
            onDismiss={() => setShowWalletSheet(false)}
          />
        )}
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
        {showWalletSheet && (
          <WalletSheet
            walletUrl={result?.walletUrl}
            applePassUrl={result?.applePassUrl}
            onDismiss={() => setShowWalletSheet(false)}
          />
        )}
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
            onChange={handlePhoneChange}
            autoComplete="tel"
            style={{ '--focus-color': color }}
          />

          {checkingPhone && (
            <p className="sp-checking">Checking…</p>
          )}

          {isReturning === false && (
            <>
              <label className="sp-label" style={{ marginTop: '0.75rem' }}>
                Your name <span className="sp-required">*</span>
              </label>
              <input
                className="sp-input"
                type="text"
                placeholder="e.g. Sara"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="given-name"
                autoFocus
                style={{ '--focus-color': color }}
              />
            </>
          )}

          {program?.staffPin && (
            <div className="sp-staff-section">
              <div className="sp-staff-divider"><span>Staff only</span></div>
              <label className="sp-label">
                🔒 Staff PIN <span className="sp-required">*</span>
              </label>
              <input
                className="sp-input sp-pin-input"
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                autoComplete="off"
                style={{ '--focus-color': color }}
              />
            </div>
          )}

          {error && <p className="sp-error-msg">{error}</p>}
          <button
            className="sp-btn"
            type="submit"
            disabled={submitting || !phone.trim() || checkingPhone}
            style={{ background: color }}
          >
            {submitting ? 'Adding stamp…' : '＋ Add Stamp'}
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
