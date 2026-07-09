import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Frown, Hand, ArrowRight } from 'lucide-react';
import { CustomerBackButton, CustomerBottomNav } from '../components/CustomerChrome';
import './StampPage.css';
import './CardPage.css';

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
        <p className="sp-sheet-title">Save your cashback card</p>
        <p className="sp-sheet-sub">Add it to your wallet — your balance updates automatically each visit.</p>
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

export default function CardPage() {
  const { slug } = useParams();
  const [business, setBusiness]         = useState(null);
  const [program, setProgram]           = useState(null);
  const [view, setView]                 = useState(STATES.LOADING);
  const [phone, setPhone]               = useState('');
  const [name, setName]                 = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState('');
  const [showWallet, setShowWallet]     = useState(false);
  const inputRef = useRef(null);
  const rewardRef = useRef(null);
  const isNumericId = /^\d+$/.test(slug || '');
  const programParam = isNumericId
    ? `restaurantId=${encodeURIComponent(slug)}`
    : `slug=${encodeURIComponent(slug || '')}`;
  const programAction = isNumericId ? 'cashback-program' : 'program';

  useEffect(() => {
    if (!slug) { setView(STATES.ERROR); return; }
    fetch(`${API}?action=${programAction}&${programParam}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.program) {
          setBusiness(data.restaurant || data.business || data.program);
          setProgram(data.program);
          setView(STATES.ENTER);
        } else {
          setView(STATES.ERROR);
        }
      })
      .catch(() => setView(STATES.ERROR));
  }, [slug, programAction, programParam]);

  useEffect(() => {
    if (view === STATES.ENTER) setTimeout(() => inputRef.current?.focus(), 200);
  }, [view]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!phone.trim()) return;
    setSubmitting(true); setError('');
    try {
      const viewParam = isNumericId ? `restaurantId=${encodeURIComponent(slug)}` : `slug=${encodeURIComponent(slug)}`;
      const nameParam = name.trim() ? `&name=${encodeURIComponent(name.trim())}` : '';
      const res = await fetch(`${API}?action=cashback-balance&${viewParam}&phone=${encodeURIComponent(phone.trim())}${nameParam}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult({
        ...data,
        account: data.account || {
          balance: data.balance ?? 0,
          totalEarned: data.totalEarned ?? 0,
          totalRedeemed: data.totalRedeemed ?? 0,
        },
      });
      saveCustomerCard({
        id: slug,
        type: 'cashback',
        businessName: business?.name || business?.businessName || 'Cashback Card',
      }, phone.trim());
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

  function scrollToReward() {
    rewardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        <div className="sp-error-icon"><Frown size={48} strokeWidth={1.5} /></div>
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
        <CustomerBackButton />
        <div className="cb-card-header">
          <div className="cb-card-header-top">
            <p className="cb-business-name">{business?.name || business?.businessName}</p>
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
            {result.customer?.name
              ? <>Hi {result.customer.name}! <Hand size={20} strokeWidth={2} style={{ verticalAlign: '-3px' }} /></>
              : 'Your Card'}
          </h2>
          <p className="sp-stamped-sub">
            {hasBalance
              ? <>You have <strong>PKR {balance.toLocaleString('en-PK')}</strong> cashback to redeem at the counter.</>
              : "You'll earn cashback on your next visit. Ask the staff to add it at checkout."}
          </p>

          <div className="cb-stats-row" ref={rewardRef}>
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

          <WalletActions walletUrl={result.walletUrl} />

          <button className="sp-btn sp-btn-outline-brand" style={{ borderColor: '#059669', color: '#059669', marginTop: '0.75rem' }} onClick={goBack}>
            Done
          </button>
          <Link className="sp-customer-link" to="/customer">View all my cards</Link>
        </div>

        {showWallet && <WalletSheet walletUrl={result.walletUrl} onDismiss={() => setShowWallet(false)} />}

        <div className="sp-footer">
          <p>Powered by <strong>decidr loyalty</strong></p>
        </div>
        <CustomerBottomNav active="reward" onReward={scrollToReward} />
      </div>
    );
  }

  return (
    <div className="sp" style={{ '--brand': '#059669' }}>
      <CustomerBackButton />
      <div className="cb-card-header">
        <div className="cb-card-header-top">
          <p className="cb-business-name">{business?.name || business?.businessName}</p>
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
        <p className="sp-sub">Enter your phone number to view your balance and save your card to your wallet.</p>

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
            {submitting ? 'Loading…' : <>View My Card <ArrowRight size={17} strokeWidth={2.5} /></>}
          </button>
        </form>

        <p className="sp-privacy">
          Your details are only used for your cashback card. No spam, ever.
        </p>
      </div>

      <div className="sp-footer">
        <p>Powered by <strong>decidr loyalty</strong></p>
      </div>
      <CustomerBottomNav active="home" />
    </div>
  );
}
