import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Frown, BadgeCheck, Check, Gift, Star, ArrowRight } from 'lucide-react';
import { CustomerBackButton, CustomerBottomNav } from '../components/CustomerChrome';
import './StampPage.css';

const API = '/api/loyalty';
const STATES = { LOADING: 'loading', ENTER: 'enter', CARD: 'card', ERROR: 'error' };
const CUSTOMER_PHONE_KEY = 'decidr_customer_phone';
const CUSTOMER_CARDS_KEY = 'decidr_customer_cards';

function saveCustomerCard(card, phone) {
  try {
    const cards = JSON.parse(localStorage.getItem(CUSTOMER_CARDS_KEY) || '[]');
    const list = Array.isArray(cards) ? cards : [];
    const next = { ...card, savedAt: Date.now() };
    localStorage.setItem(CUSTOMER_PHONE_KEY, phone);
    localStorage.setItem(
      CUSTOMER_CARDS_KEY,
      JSON.stringify([next, ...list.filter(c => !(String(c.id) === String(next.id) && c.type === next.type))])
    );
  } catch {}
}

function WalletSheet({ walletUrl, onDismiss }) {
  if (!walletUrl) return null;
  return (
    <div className="sp-sheet-backdrop" onClick={onDismiss}>
      <div className="sp-sheet" onClick={e => e.stopPropagation()}>
        <div className="sp-sheet-handle" />
        <p className="sp-sheet-title">Save your loyalty card</p>
        <p className="sp-sheet-sub">Add it to your wallet so you always have it handy.</p>

        <WalletActions walletUrl={walletUrl} />

        <button className="sp-sheet-dismiss" onClick={onDismiss}>Not now</button>
      </div>
    </div>
  );
}

function WalletActions({ walletUrl }) {
  return (
    <div className="sp-wallet-actions">
      {walletUrl && (
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
      <button type="button" className="sp-wallet-btn sp-awallet-btn sp-wallet-disabled" disabled>
        <svg className="sp-wallet-icon" viewBox="0 0 24 24" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        Apple Wallet <span>Coming soon</span>
      </button>
    </div>
  );
}

export default function StampPage() {
  const { slug } = useParams();
  const [program, setProgram]         = useState(null);
  const [view, setView]               = useState(STATES.LOADING);
  const [phone, setPhone]             = useState('');
  const [name, setName]               = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState('');
  const [isReturning, setIsReturning] = useState(null);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [showWalletSheet, setShowWalletSheet] = useState(false);
  const inputRef     = useRef(null);
  const phoneCheckRef = useRef(null);
  const rewardRef = useRef(null);

  const isNumericId  = /^\d+$/.test(slug);
  const programParam = isNumericId ? `restaurantId=${slug}` : `slug=${slug}`;

  useEffect(() => {
    if (!slug) { setView(STATES.ERROR); return; }
    fetch(`${API}?action=program&${programParam}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.program) { setProgram(data.program); setView(STATES.ENTER); }
        else setView(STATES.ERROR);
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
      setError('Please enter your name — required for first-time customers.');
      return;
    }
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API}?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isNumericId ? { restaurantId: slug } : { slug }),
          phone: phone.trim(),
          name: name.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      saveCustomerCard({
        id: slug,
        type: 'stamp',
        businessName: program?.name || 'Loyalty Card',
        logoUrl: program?.logoUrl || '',
      }, phone.trim());
      setResult(data);
      setView(STATES.CARD);
      if (data.walletUrl || data.applePassUrl) {
        setTimeout(() => setShowWalletSheet(true), 700);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function goBack() {
    setPhone(''); setName(''); setResult(null); setError('');
    setIsReturning(null); setCheckingPhone(false); setShowWalletSheet(false);
    setView(STATES.ENTER);
  }

  function scrollToReward() {
    rewardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const color  = program?.primaryColor || '#ff0000';
  const stamps = program?.stampsRequired || 9;
  const reward = program?.rewardName || 'Free Reward';
  const businessName = program?.name || 'Loyalty Card';
  const businessInitial = (businessName[0] || 'L').toUpperCase();

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
        <div className="sp-error-icon"><Frown size={48} strokeWidth={1.5} /></div>
        <h2>Program not found</h2>
        <p>This loyalty program doesn't exist or has been deactivated.</p>
      </div>
    );
  }

  /* ── Card registered ── */
  if (view === STATES.CARD) {
    const count = result?.card?.stampCount ?? 0;
    const remaining = Math.max(0, stamps - count);
    const progress = Math.min(100, (count / stamps) * 100);
    const customerName = result?.customer?.name || name || 'Customer';
    return (
      <div className="sp" style={{ '--brand': color }}>
        <CustomerBackButton />
        <div className="sp-app-shell">
          <section className="sp-progress-hero" style={{ background: color }}>
            <div className="sp-hero-top">
              <div className="sp-logo-lockup">
                <div className="sp-restaurant-logo">
                  {program.logoUrl
                    ? <img src={program.logoUrl} alt={`${businessName} logo`} />
                    : <span>{businessInitial}</span>}
                </div>
                <span>Loyalty Card</span>
              </div>
              <span className="sp-premium"><BadgeCheck size={13} strokeWidth={2.25} /> Premium Partner</span>
            </div>
            <p className="sp-hello">Hi, {customerName}</p>
            <h1>{count} of {stamps} Stamps</h1>
            <div className="sp-progress-line">
              <span style={{ width: `${progress}%` }} />
            </div>
          </section>

          <main className="sp-app-body">
            <section className="sp-next-treat">
              <div className="sp-treat-art sp-treat-logo">
                {program.logoUrl
                  ? <img src={program.logoUrl} alt={`${businessName} logo`} />
                  : <span>{businessInitial}</span>}
              </div>
              <div>
                <p>Your next treat</p>
                <h2>{reward}</h2>
                <span>{remaining > 0 ? `Collect ${remaining} more stamp${remaining === 1 ? '' : 's'}` : 'Ready to claim at the counter'}</span>
              </div>
            </section>

            <section className="sp-stamp-card-panel" ref={rewardRef}>
              <p className="sp-section-label">Stamp Card</p>
              <div className="sp-stamp-row">
                {Array.from({ length: stamps }, (_, i) => (
                  <span
                    key={i}
                    className={`sp-app-stamp${i < count ? ' filled' : ''}${i === stamps - 1 ? ' reward' : ''}`}
                    style={i < count ? { background: color, borderColor: color } : {}}
                  >
                    {i < count ? <Check size={18} strokeWidth={2.75} /> : i === stamps - 1 ? <Gift size={16} strokeWidth={2} /> : ''}
                  </span>
                ))}
              </div>
              <p className="sp-away">
                {remaining > 0
                  ? <>You're <strong style={{ color }}>{remaining} stamp{remaining === 1 ? '' : 's'}</strong> away from your treat!</>
                  : <>Your reward is ready!</>}
              </p>
              <button className="sp-claim-btn" disabled={remaining > 0} style={{ background: color }}>
                <Gift size={20} strokeWidth={2} /> Claim Reward
              </button>
            </section>

            <a className="sp-review-btn" href="https://www.google.com/search?q=google+review" target="_blank" rel="noopener noreferrer">
              <Star size={18} strokeWidth={2} fill="currentColor" /> Rate us on Google
            </a>

            <WalletActions walletUrl={result?.walletUrl} />

            <div className="sp-card-links">
              <button className="sp-text-btn" onClick={goBack}>Done</button>
              <Link className="sp-text-btn" to="/customer">View all cards</Link>
            </div>
          </main>

          <CustomerBottomNav active="home" onReward={scrollToReward} />
        </div>

        {showWalletSheet && (
          <WalletSheet
            walletUrl={result?.walletUrl}
            onDismiss={() => setShowWalletSheet(false)}
          />
        )}

        <div className="sp-footer sp-footer-floating">
          <p>Powered by <strong>decidr loyalty</strong></p>
        </div>
      </div>
    );
  }

  /* ── Enter details ── */
  return (
    <div className="sp" style={{ '--brand': color }}>
      <CustomerBackButton />
      <div className="sp-header" style={{ background: color }}>
        {program.logoUrl
          ? <img src={program.logoUrl} alt={program.name} className="sp-logo" />
          : <p className="sp-cafe-name">{program.name || 'Loyalty Card'}</p>
        }
        <p className="sp-header-sub">Digital Loyalty Card</p>
      </div>

      <div className="sp-body">
        <h2 className="sp-title">Get your loyalty card</h2>
        <p className="sp-sub">Enter your details and save your card. Staff will stamp it each visit.</p>

        <div className="sp-dots-wrap">
          <div className="sp-dots">
            {Array.from({ length: stamps }, (_, i) => (
              <span key={i} className="sp-dot sp-dot-preview" style={{ borderColor: color + '55' }} />
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

          {checkingPhone && <p className="sp-checking">Checking…</p>}

          {/* Name — always shown, required for new customers */}
          <label className="sp-label" style={{ marginTop: '0.75rem' }}>
            Your name{isReturning === false
              ? <span className="sp-required"> *</span>
              : <span className="sp-optional"> (optional)</span>
            }
          </label>
          <input
            className="sp-input"
            type="text"
            placeholder="e.g. Sara"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="given-name"
            style={{ '--focus-color': color }}
          />

          {error && <p className="sp-error-msg">{error}</p>}
          <button
            className="sp-btn"
            type="submit"
            disabled={submitting || !phone.trim() || checkingPhone}
            style={{ background: color }}
          >
            {submitting ? 'Saving…' : <>Get My Card <ArrowRight size={17} strokeWidth={2.5} /></>}
          </button>
        </form>

        <p className="sp-privacy">
          Your details are only used for your loyalty card. No spam, ever.
        </p>
      </div>

      <div className="sp-footer">
        <p>Powered by <strong>decidr loyalty</strong></p>
      </div>
      <CustomerBottomNav active="home" />
    </div>
  );
}
