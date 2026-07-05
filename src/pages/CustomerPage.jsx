import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomerPage.css';

const API = '/api/loyalty';
const PHONE_KEY = 'decidr_customer_phone';
const CARDS_KEY = 'decidr_customer_cards';

function readCards() {
  try {
    const cards = JSON.parse(localStorage.getItem(CARDS_KEY) || '[]');
    return Array.isArray(cards) ? cards : [];
  } catch {
    return [];
  }
}

function saveCards(cards) {
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
}

function normalizeCardInput(value) {
  const raw = value.trim();
  if (!raw) return null;
  const match = raw.match(/\/(card|stamp)\/([^/?#]+)/i);
  if (match) return { type: match[1] === 'card' ? 'cashback' : 'stamp', id: decodeURIComponent(match[2]) };
  return { id: raw };
}

async function fetchJson(url) {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Unable to refresh card');
  return data;
}

function idParam(id) {
  return /^\d+$/.test(String(id)) ? `restaurantId=${encodeURIComponent(id)}` : `slug=${encodeURIComponent(id)}`;
}

async function loadStampCard(card, phone) {
  const param = idParam(card.id);
  const [programData, cardData] = await Promise.all([
    fetchJson(`${API}?action=program&${param}`),
    fetchJson(`${API}?action=card&phone=${encodeURIComponent(phone)}&${param}`),
  ]);
  return {
    ...card,
    status: 'ready',
    businessName: programData.program?.name || card.businessName || 'Loyalty Card',
    color: programData.program?.primaryColor || '#ff0000',
    rewardName: programData.program?.rewardName || 'Reward',
    stampsRequired: programData.program?.stampsRequired || 9,
    stampCount: cardData.card?.stampCount ?? 0,
    rewardCount: cardData.card?.rewardCount ?? 0,
  };
}

async function loadCashbackCard(card, phone) {
  const numeric = /^\d+$/.test(String(card.id));
  const param = idParam(card.id);
  const programAction = numeric ? 'cashback-program' : 'program';
  const [programData, balanceData] = await Promise.all([
    fetchJson(`${API}?action=${programAction}&${param}`),
    fetchJson(`${API}?action=cashback-balance&${param}&phone=${encodeURIComponent(phone)}`),
  ]);
  return {
    ...card,
    status: 'ready',
    businessName:
      programData.restaurant?.name ||
      programData.business?.name ||
      programData.program?.name ||
      card.businessName ||
      'Cashback Card',
    cashbackRate: programData.program?.cashbackRate ?? null,
    balance: balanceData.balance ?? balanceData.account?.balance ?? 0,
    totalEarned: balanceData.totalEarned ?? balanceData.account?.totalEarned ?? 0,
    totalRedeemed: balanceData.totalRedeemed ?? balanceData.account?.totalRedeemed ?? 0,
  };
}

function CustomerCard({ card, phone, onRemove }) {
  const isCashback = card.type === 'cashback';
  const href = isCashback ? `/card/${card.id}` : `/stamp/${card.id}`;
  const progress = card.stampsRequired ? Math.min(100, ((card.stampCount || 0) / card.stampsRequired) * 100) : 0;
  const color = isCashback ? '#059669' : (card.color || '#a40818');
  const remaining = Math.max(0, (card.stampsRequired || 9) - (card.stampCount || 0));

  return (
    <article className={`cp-card cp-card--${card.type}`} style={{ '--card-color': color }}>
      <div className="cp-card-top">
        <div>
          <p className="cp-card-kicker">{isCashback ? 'Cashback' : 'Stamp card'}</p>
          <h2>{card.businessName || (isCashback ? 'Cashback Card' : 'Loyalty Card')}</h2>
        </div>
        <Link to={href} className="cp-icon-link" aria-label="Open card">Open</Link>
      </div>

      {card.status === 'error' ? (
        <p className="cp-card-error">{card.error || 'Could not refresh this card.'}</p>
      ) : isCashback ? (
        <div className="cp-cashback-panel">
          <span>Available balance</span>
          <strong>PKR {(card.balance || 0).toLocaleString('en-PK')}</strong>
          {card.cashbackRate != null && <small>{card.cashbackRate}% cashback on purchases</small>}
        </div>
      ) : (
        <div className="cp-stamp-panel">
          <div className="cp-stamp-dots">
            {Array.from({ length: Math.min(card.stampsRequired || 9, 8) }, (_, i) => (
              <span key={i} className={i < (card.stampCount || 0) ? 'filled' : ''}>
                {i < (card.stampCount || 0) ? '✓' : ''}
              </span>
            ))}
          </div>
          <div className="cp-progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p><strong>{card.stampCount || 0}</strong> / {card.stampsRequired || 9} stamps</p>
          <small>{remaining > 0 ? `${remaining} more for ${card.rewardName || 'Reward'}` : `${card.rewardName || 'Reward'} ready`}</small>
        </div>
      )}

      <div className="cp-card-actions">
        <span>{phone}</span>
        <button type="button" onClick={() => onRemove(card.id, card.type)}>Remove</button>
      </div>
    </article>
  );
}

export default function CustomerPage() {
  const [phone, setPhone] = useState(() => localStorage.getItem(PHONE_KEY) || '');
  const [phoneDraft, setPhoneDraft] = useState(() => localStorage.getItem(PHONE_KEY) || '');
  const [cards, setCards] = useState(() => readCards());
  const [cardInput, setCardInput] = useState('');
  const [cardType, setCardType] = useState('cashback');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const hasPhone = phone.trim().length > 0;
  const sortedCards = useMemo(() => [...cards].sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0)), [cards]);

  useEffect(() => {
    saveCards(cards);
  }, [cards]);

  useEffect(() => {
    if (hasPhone && cards.length) refreshCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  function savePhone(e) {
    e.preventDefault();
    const clean = phoneDraft.trim();
    if (!clean) return;
    localStorage.setItem(PHONE_KEY, clean);
    setPhone(clean);
    setMessage('');
  }

  function addCard(e) {
    e.preventDefault();
    const parsed = normalizeCardInput(cardInput);
    if (!parsed) return;
    const next = {
      type: parsed.type || cardType,
      id: parsed.id,
      savedAt: Date.now(),
    };
    if (!parsed.type) next.type = cardType;
    setCards(prev => {
      const withoutDuplicate = prev.filter(c => !(String(c.id) === String(next.id) && c.type === next.type));
      return [next, ...withoutDuplicate];
    });
    setCardInput('');
    setMessage('Card added. Refreshing now.');
    setTimeout(() => refreshCards([next, ...cards.filter(c => !(String(c.id) === String(next.id) && c.type === next.type))]), 0);
  }

  async function refreshCards(cardsToRefresh = cards) {
    if (!phone.trim()) return;
    setLoading(true);
    setMessage('');
    const refreshed = await Promise.all(cardsToRefresh.map(async card => {
      try {
        return card.type === 'cashback'
          ? await loadCashbackCard(card, phone.trim())
          : await loadStampCard(card, phone.trim());
      } catch (err) {
        return { ...card, status: 'error', error: err.message };
      }
    }));
    setCards(refreshed);
    setLoading(false);
  }

  function removeCard(id, type) {
    setCards(prev => prev.filter(card => !(String(card.id) === String(id) && card.type === type)));
  }

  function resetPhone() {
    localStorage.removeItem(PHONE_KEY);
    setPhone('');
    setPhoneDraft('');
  }

  return (
    <div className="cp">
      <header className="cp-header">
        <Link to="/" className="cp-brand">
          <img src="/decidr-logo.png" alt="decidr" />
          <span>loyalty</span>
        </Link>
        {hasPhone && <button className="cp-link-btn" onClick={resetPhone}>Change phone</button>}
      </header>

      <main className="cp-main">
        <section className="cp-hero">
          <p className="cp-eyebrow">Customer rewards</p>
          <h1>Your cards, rewards, and treats</h1>
          <p>Keep every business card in one simple mobile wallet-style app.</p>
        </section>

        {!hasPhone ? (
          <form className="cp-panel cp-phone-form" onSubmit={savePhone}>
            <label>Phone number</label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="03XX XXXXXXX"
              value={phoneDraft}
              onChange={e => setPhoneDraft(e.target.value)}
              autoComplete="tel"
            />
            <button type="submit" disabled={!phoneDraft.trim()}>Continue</button>
          </form>
        ) : (
          <>
            <section className="cp-panel cp-toolbar">
              <div>
                <span className="cp-muted">Signed in as</span>
                <strong>{phone}</strong>
              </div>
              <button type="button" onClick={() => refreshCards()} disabled={loading || cards.length === 0}>
                {loading ? 'Refreshing...' : 'Refresh cards'}
              </button>
            </section>

            <form className="cp-panel cp-add-form" onSubmit={addCard}>
              <div className="cp-type-switch">
                <button type="button" className={cardType === 'cashback' ? 'active' : ''} onClick={() => setCardType('cashback')}>Cashback</button>
                <button type="button" className={cardType === 'stamp' ? 'active' : ''} onClick={() => setCardType('stamp')}>Stamp</button>
              </div>
              <label>Business card link or ID</label>
              <div className="cp-add-row">
                <input
                  value={cardInput}
                  onChange={e => setCardInput(e.target.value)}
                  placeholder="Paste /card/5, /stamp/5, or enter 5"
                />
                <button type="submit" disabled={!cardInput.trim()}>Add</button>
              </div>
              {message && <p className="cp-message">{message}</p>}
            </form>

            <section className="cp-cards">
              {sortedCards.length === 0 ? (
                <div className="cp-empty">
                  <h2>No cards yet</h2>
                  <p>Scan a business QR code or paste its card link above to add your first reward card.</p>
                </div>
              ) : (
                sortedCards.map(card => (
                  <CustomerCard
                    key={`${card.type}-${card.id}`}
                    card={card}
                    phone={phone}
                    onRemove={removeCard}
                  />
                ))
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
