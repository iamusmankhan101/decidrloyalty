import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './StampPage.css';
import './CardPage.css';

const API = '/api/loyalty';
const STATES = { LOADING: 'loading', ENTER: 'enter', CARD: 'card', ERROR: 'error' };

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

function WalletSheet({ walletUrl, onDismiss }) {
  if (!walletUrl) return null;
  return (
    <div className="sp-sheet-backdrop" onClick={onDismiss}>
      <div className="sp-sheet" onClick={e => e.stopPropagation()}>
        <div className="sp-sheet-handle" />
        <p className="sp-sheet-title">Save your cashback card</p>
        <p className="sp-sheet-sub">Add it to your wallet — your balance updates automatically each visit.</p>
        {!isIOS && (
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
        {isIOS && (
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

export default function CardPage() {
  const { slug } = useParams();
  const [salon, setSalon]               = useState(null);
  const [program, setProgram]           = useState(null);
  const [view, setView]                 = useState(STATES.LOADING);
  const [phone, setPhone]               = useState('');
  const [name, setName]                 = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState('');
  const [showWallet, setShowWallet]     = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!slug) { setView(STATES.ERROR); return; }
    fetch(`${API}?action=cashback-salon&slug=${encodeURIComponent(slug)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.restaurant) {
          setSalon(data.restaurant);
          setProgram(data.program);
          setView(STATES.ENTER);
        } else {
          setView(STATES.ERROR);
        }
      })
      .catch(() => setView(STATES.ERROR));
  }, [slug]);

  useEffect(() => {
    if (view === STATES.ENTER) setTimeout(() => inputRef.current?.focus(), 200);
  }, [view]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!phone.trim()) return;
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API}?action=cashback-view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, phone: phone.trim(), name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
      setView(STATES.CARD);
      if (data.walletUrl) setTimeout(() => setShowWallet(true), 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function goBack() {
    setPhone(''); setName(''); setResult(null); setError(''); setShowWallet(false);
    setView(STATES.ENTER);
  }

  if (view === STATES.LOADING) {
    return (
      <div className="sp-loading">
        <div className="sp-spinner" style={{ borderTopColor: '#059669' }} />
        <p>Loading…</p>
      </div>
    );
  }

  if (view === STATES.ERROR) {
    return (
      <div className="sp-error">
        <div className="sp-error-icon">😕</div>
        <h2>Program not found</h2>
        <p>This cashback program doesn't exist or has been deactivated.</p>
      </div>
    );
  }

  if (view === STATES.CARD && result) {
    const balance      = result.account?.balance      ?? 0;
    const totalEarned  = result.account?.totalEarned  ?? 0;
    const totalRedeemed= result.account?.totalRedeemed ?? 0;
    const hasBalance   = balance > 0;
    return (
      <div className="sp" style={{ '--brand': '#059669' }}>
        <div className="cb-card-header">
          <div className="cb-card-header-top">
            <p className="cb-salon-name">{salon?.name}</p>
            <span className="cb-badge">Cashback Card</span>
          </div>
          <div className="cb-balance-hero">
            <div className="cb-balance-label">Available Balance</div>
            <div className="cb-balance-amount">PKR {balance.toLocaleString('en-PK')}</div>
            {program?.cashbackRate && (
              <div className="cb-rate-pill">{program.cashbackRate}% cashback on every visit</div>
            )}
          </div>
        </div>

        <div className="sp-body">
          <h2 className="sp-stamped-title" style={{ color: '#065f46' }}>
            {result.customer?.name ? `Hi ${result.customer.name}! 👋` : 'Your Card'}
          </h2>
          <p className="sp-stamped-sub">
            {hasBalance
              ? <>You have <strong>PKR {balance.toLocaleString('en-PK')}</strong> cashback to redeem at the counter.</>
              : 'You'll earn cashback on your next visit. Ask the staff to add it at checkout.'}
          </p>

          <div className="cb-stats-row">
            <div className="cb-stat">
              <div className="cb-stat-value">PKR {totalEarned.toLocaleString('en-PK')}</div>
              <div className="cb-stat-label">Total Earned</div>
            </div>
            <div className="cb-stat-divider" />
            <div className="cb-stat">
              <div className="cb-stat-value">PKR {totalRedeemed.toLocaleString('en-PK')}</div>
              <div className="cb-stat-label">Total Redeemed</div>
            </div>
          </div>

          {result.walletUrl && (
            <a href={result.walletUrl} target="_blank" rel="noopener noreferrer" className="cb-wallet-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#4285F4"/>
                <path d="M20 4H4C2.9 4 2 4.9 2 6v2h20V6c0-1.1-.9-2-2-2z" fill="#1A73E8"/>
                <circle cx="16" cy="14" r="3" fill="#FBBC04"/>
                <path d="M16 11v6M13 14h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Add to Google Wallet
            </a>
          )}

          <button className="sp-btn sp-btn-outline-brand" style={{ borderColor: '#059669', color: '#059669', marginTop: '0.75rem' }} onClick={goBack}>
            Done
          </button>
        </div>

        {showWallet && <WalletSheet walletUrl={result.walletUrl} onDismiss={() => setShowWallet(false)} />}

        <div className="sp-footer">
          <p>Powered by <strong>decidr loyalty</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="sp" style={{ '--brand': '#059669' }}>
      <div className="cb-card-header">
        <div className="cb-card-header-top">
          <p className="cb-salon-name">{salon?.name}</p>
          <span className="cb-badge">Cashback Card</span>
        </div>
        <div className="cb-balance-hero">
          <div className="cb-balance-label">Enter your phone to check</div>
          <div className="cb-balance-amount" style={{ fontSize: '2rem', opacity: 0.5 }}>PKR ···</div>
          {program?.cashbackRate && (
            <div className="cb-rate-pill">{program.cashbackRate}% cashback on every visit</div>
          )}
        </div>
      </div>

      <div className="sp-body">
        <h2 className="sp-title">Your Cashback Card</h2>
        <p className="sp-sub">Enter your phone number to view your balance and save your card to Google Wallet.</p>

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
            style={{ '--focus-color': '#059669' }}
          />

          <label className="sp-label" style={{ marginTop: '0.75rem' }}>
            Your name <span className="sp-optional">(optional)</span>
          </label>
          <input
            className="sp-input"
            type="text"
            placeholder="e.g. Sara"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="given-name"
            style={{ '--focus-color': '#059669' }}
          />

          {error && <p className="sp-error-msg">{error}</p>}

          <button
            className="sp-btn"
            type="submit"
            disabled={submitting || !phone.trim()}
            style={{ background: submitting || !phone.trim() ? '#94a3b8' : '#059669' }}
          >
            {submitting ? 'Loading…' : 'View My Card →'}
          </button>
        </form>

        <p className="sp-privacy">
          Your details are only used for your cashback card. No spam, ever.
        </p>
      </div>

      <div className="sp-footer">
        <p>Powered by <strong>decidr loyalty</strong></p>
      </div>
    </div>
  );
}
