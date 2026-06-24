import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const WavyLines = () => (
  <svg className="lp-wavy-svg" viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* top-left → bottom-right diagonal */}
    <path className="lp-wave lp-wave-1"
      d="M -100 60 C 280 20, 580 180, 900 140 C 1150 110, 1350 260, 1600 220"
      fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="35" strokeLinecap="round"/>
    {/* right → left, mid-upper area */}
    <path className="lp-wave lp-wave-2"
      d="M 1600 320 C 1200 280, 950 420, 650 360 C 380 300, 150 440, -100 390"
      fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="35" strokeLinecap="round"/>
    {/* bottom-left → top-right diagonal */}
    <path className="lp-wave lp-wave-3"
      d="M -100 780 C 200 680, 450 760, 700 640 C 950 520, 1150 600, 1600 480"
      fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="35" strokeLinecap="round"/>
    {/* top-right → bottom-left */}
    <path className="lp-wave lp-wave-4"
      d="M 1600 80 C 1250 160, 1000 60, 720 200 C 460 330, 200 220, -100 340"
      fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="35" strokeLinecap="round"/>
    {/* center, short curve top-to-bottom */}
    <path className="lp-wave lp-wave-5"
      d="M 580 -50 C 480 150, 720 300, 560 500 C 420 680, 680 740, 580 900"
      fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="35" strokeLinecap="round"/>
  </svg>
);

const QRMockup = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', width: '100%', height: '100%', shapeRendering: 'crispEdges' }}>
    <rect x="5"  y="5"  width="28" height="28" fill="#111"/>
    <rect x="9"  y="9"  width="20" height="20" fill="white"/>
    <rect x="13" y="13" width="12" height="12" fill="#111"/>
    <rect x="67" y="5"  width="28" height="28" fill="#111"/>
    <rect x="71" y="9"  width="20" height="20" fill="white"/>
    <rect x="75" y="13" width="12" height="12" fill="#111"/>
    <rect x="5"  y="67" width="28" height="28" fill="#111"/>
    <rect x="9"  y="71" width="20" height="20" fill="white"/>
    <rect x="13" y="75" width="12" height="12" fill="#111"/>
    <rect x="40" y="5"  width="5" height="5" fill="#111"/>
    <rect x="50" y="5"  width="5" height="5" fill="#111"/>
    <rect x="60" y="5"  width="5" height="5" fill="#111"/>
    <rect x="40" y="13" width="5" height="5" fill="#111"/>
    <rect x="55" y="16" width="5" height="5" fill="#111"/>
    <rect x="45" y="22" width="5" height="5" fill="#111"/>
    <rect x="58" y="25" width="5" height="5" fill="#111"/>
    <rect x="5"  y="40" width="5" height="5" fill="#111"/>
    <rect x="14" y="47" width="5" height="5" fill="#111"/>
    <rect x="22" y="40" width="5" height="5" fill="#111"/>
    <rect x="25" y="53" width="5" height="5" fill="#111"/>
    <rect x="5"  y="57" width="5" height="5" fill="#111"/>
    <rect x="15" y="60" width="5" height="5" fill="#111"/>
    <rect x="40" y="40" width="5" height="5" fill="#111"/>
    <rect x="50" y="40" width="5" height="5" fill="#111"/>
    <rect x="60" y="40" width="5" height="5" fill="#111"/>
    <rect x="70" y="40" width="5" height="5" fill="#111"/>
    <rect x="80" y="40" width="5" height="5" fill="#111"/>
    <rect x="90" y="40" width="5" height="5" fill="#111"/>
    <rect x="43" y="48" width="5" height="5" fill="#111"/>
    <rect x="55" y="50" width="5" height="5" fill="#111"/>
    <rect x="65" y="48" width="5" height="5" fill="#111"/>
    <rect x="75" y="50" width="5" height="5" fill="#111"/>
    <rect x="88" y="48" width="5" height="5" fill="#111"/>
    <rect x="40" y="57" width="5" height="5" fill="#111"/>
    <rect x="53" y="58" width="5" height="5" fill="#111"/>
    <rect x="63" y="57" width="5" height="5" fill="#111"/>
    <rect x="73" y="58" width="5" height="5" fill="#111"/>
    <rect x="85" y="57" width="5" height="5" fill="#111"/>
    <rect x="40" y="67" width="5" height="5" fill="#111"/>
    <rect x="53" y="70" width="5" height="5" fill="#111"/>
    <rect x="62" y="67" width="5" height="5" fill="#111"/>
    <rect x="72" y="72" width="5" height="5" fill="#111"/>
    <rect x="83" y="67" width="5" height="5" fill="#111"/>
    <rect x="90" y="70" width="5" height="5" fill="#111"/>
    <rect x="43" y="78" width="5" height="5" fill="#111"/>
    <rect x="55" y="80" width="5" height="5" fill="#111"/>
    <rect x="66" y="78" width="5" height="5" fill="#111"/>
    <rect x="78" y="82" width="5" height="5" fill="#111"/>
    <rect x="88" y="78" width="5" height="5" fill="#111"/>
    <rect x="40" y="88" width="5" height="5" fill="#111"/>
    <rect x="50" y="90" width="5" height="5" fill="#111"/>
    <rect x="62" y="87" width="5" height="5" fill="#111"/>
    <rect x="73" y="90" width="5" height="5" fill="#111"/>
    <rect x="84" y="87" width="5" height="5" fill="#111"/>
    <rect x="92" y="90" width="5" height="5" fill="#111"/>
  </svg>
);

const PhoneMockup = () => (
  <div className="lp-phone">
    <div className="lp-phone-island" />
    <div className="lp-phone-status">
      <span className="lp-phone-time">9:41</span>
      <div className="lp-phone-status-icons">
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <rect x="0"    y="4"   width="3" height="7"    rx="0.8" fill="white"/>
          <rect x="4.5"  y="2.5" width="3" height="8.5"  rx="0.8" fill="white"/>
          <rect x="9"    y="0"   width="3" height="11"   rx="0.8" fill="white"/>
          <rect x="13.5" y="0"   width="3" height="11"   rx="0.8" fill="white" fillOpacity="0.3"/>
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
          <rect x="0.5" y="0.5" width="20" height="10" rx="2" stroke="white" strokeOpacity="0.6" strokeWidth="1"/>
          <rect x="21"  y="3.5" width="2"  height="4"  rx="1" fill="white" fillOpacity="0.5"/>
          <rect x="2"   y="2"   width="15" height="7"  rx="1" fill="white"/>
        </svg>
      </div>
    </div>
    <p className="lp-phone-wallet">WALLET</p>
    <div className="lp-loyalty-card">
      <div className="lp-loyalty-top">
        <div>
          <p className="lp-loyalty-brand">DECIDR LOYALTY</p>
          <p className="lp-loyalty-name">Loyalty Card</p>
        </div>
        <div className="lp-loyalty-icon">☕</div>
      </div>
      <div className="lp-loyalty-stamps">
        <span className="lp-stamp lp-stamp-done">✓</span>
        {Array.from({ length: 9 }, (_, i) => <span key={i} className="lp-stamp" />)}
      </div>
      <p className="lp-loyalty-prog">1/10 · Free coffee</p>
      <div className="lp-loyalty-qr">
        <QRMockup />
      </div>
    </div>
    <p className="lp-phone-demo">
      <span className="lp-demo-dot" />Live demo — watch it fill
    </p>
  </div>
);

const HERO_STATS = ['+40% Revenue', '2x Customer Retention'];

const FEATURES = [
  { icon: '📱', title: 'Digital Stamp Cards', desc: 'Replace paper cards with a seamless digital experience customers actually use.' },
  { icon: '👛', title: 'Google Wallet Ready', desc: 'Customers save their loyalty card to Google Wallet. Stamps update automatically.' },
  { icon: '🎨', title: 'Your Brand', desc: 'Fully customized with your logo, colors, and reward name.' },
  { icon: '📊', title: 'Real-time Analytics', desc: 'See who your regulars are, how many stamps are issued, and rewards redeemed.' },
  { icon: '⚡', title: '5-Minute Setup', desc: 'Set up your loyalty program, print your QR code, and go live today.' },
  { icon: '🔒', title: 'No App Needed', desc: 'Customers scan a QR code — no app download required on either side.' },
];

const HOW = [
  { step: '1', title: 'Set up your program', desc: 'Add your logo, brand color, and choose your reward (e.g. Free Coffee after 9 stamps).' },
  { step: '2', title: 'Print your QR code', desc: 'Download and display your unique QR code at the counter.' },
  { step: '3', title: 'Customers scan & collect', desc: 'They enter their phone number to add a stamp. No account needed.' },
  { step: '4', title: 'Reward your regulars', desc: 'On the 9th stamp, they get a reward screen to show the cashier.' },
];

const CARD_TYPES = [
  { name: 'Stamp Card',   icon: '☕', value: '9 / 10',      desc: 'One more visit for a free coffee',   accent: '#f97316' },
  { name: 'Cashback',     icon: '💰', value: 'PKR 340',     desc: '5% back on every purchase',          accent: '#6366f1' },
  { name: 'Membership',   icon: '👑', value: 'Platinum',    desc: 'Unlimited refills · priority queue',  accent: '#8b5cf6' },
  { name: 'Gift Card',    icon: '🎁', value: 'PKR 2,000',   desc: 'Send to a friend, redeem anywhere',  accent: '#ec4899' },
  { name: 'Coupon',       icon: '🏷️', value: '30% OFF',    desc: 'Valid this weekend only',             accent: '#f59e0b' },
  { name: 'Event Pass',   icon: '🎟️', value: 'Table #7',   desc: 'Brunch reservation · 11 AM slot',    accent: '#a855f7' },
  { name: 'Punch Card',   icon: '🥐', value: '5 / 8',      desc: 'Free pastry after 8 punches',        accent: '#3b82f6' },
  { name: 'Subscription', icon: '🔁', value: 'Active',      desc: 'Monthly flat white club · auto-renew', accent: '#10b981' },
];

const SCROLL_PER_CARD = 140;

function CardTypesSection() {
  return (
    <section className="lp-ct">
      <div className="lp-ct-glow lp-ct-glow-1" />
      <div className="lp-ct-glow lp-ct-glow-2" />
      <div className="lp-ct-inner">
        <div className="lp-ct-header">
          <span className="lp-ct-eyebrow">✦ 8 card types · one platform</span>
          <h2 className="lp-ct-heading">
            From stamp cards to memberships.<br />
            <span className="lp-ct-accent">All in the wallet.</span>
          </h2>
        </div>
        <div className="lp-ct-grid">
          {CARD_TYPES.map(c => (
            <div key={c.name} className="lp-ct-card" style={{ borderColor: `${c.accent}44` }}>
              <div className="lp-ct-card-top">
                <div>
                  <p className="lp-ct-label">DECIDR</p>
                  <p className="lp-ct-name">{c.name}</p>
                </div>
                <div className="lp-ct-icon" style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.accent}99)` }}>
                  {c.icon}
                </div>
              </div>
              <div className="lp-ct-card-bottom">
                <p className="lp-ct-value">{c.value}</p>
                <p className="lp-ct-desc">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const tunnelRef = React.useRef(null);
  const [visibleCount, setVisibleCount] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      if (!tunnelRef.current) return;
      const scrolled = -tunnelRef.current.getBoundingClientRect().top;
      if (scrolled < 0) { setVisibleCount(0); return; }
      setVisibleCount(Math.min(FEATURES.length, Math.floor(scrolled / SCROLL_PER_CARD) + 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="lp-features" id="features">
      <div className="lp-feat-tunnel" ref={tunnelRef}>
        <div className="lp-feat-pin">
          <div className="lp-features-header">
            <span className="lp-features-badge">✦ Feature rich</span>
            <h2 className="lp-features-heading">Everything your cafe needs</h2>
            <p className="lp-features-sub">Built specifically for independent cafes and small coffee shops that want to keep customers coming back.</p>
          </div>
          <div className="lp-feat-stack">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`lp-feat-card${i < visibleCount ? ' lp-feat-card--in' : ''}`}
              >
                <div className="lp-feat-icon">{f.icon}</div>
                <div className="lp-feat-body">
                  <h3 className="lp-feat-title">{f.title}</h3>
                  <p className="lp-feat-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  {
    name: 'Starter',
    badge: null,
    monthlyPrice: 'PKR 6,000',
    annualPrice: 'PKR 4,500',
    annualNote: 'Billed annually · save PKR 18,000/yr',
    desc: 'For one outlet getting started with digital loyalty.',
    posTag: 'Staff web app at counter — works with any POS',
    features: [
      '1 card type (stamps or cashback)',
      'Up to 3,500 active customers',
      'Apple & Google Wallet',
      'Staff web app for stamping (tablet at counter)',
      'Zero POS integration needed',
      'Push notifications on stamp & reward',
      'Email support',
    ],
    cta: 'Start with Starter →',
    ctaStyle: 'outline',
  },
  {
    name: 'Growth',
    badge: '⚡ Most Popular',
    monthlyPrice: 'PKR 8,000',
    annualPrice: 'PKR 6,000',
    annualNote: 'Billed annually · save PKR 24,000/yr',
    desc: 'Receipt QR codes that work with any POS printer — no extra step for staff.',
    posTag: 'Receipt QR codes — any POS printer',
    features: [
      '3 card types (stamps, cashback, membership)',
      'Up to 3,500 active customers',
      'Apple & Google Wallet',
      'Receipt QR code per transaction',
      'Works with any POS that prints receipts',
      'Push notifications & reward campaigns',
      'Real-time analytics dashboard',
      'Priority email & chat support',
    ],
    cta: 'Book a demo →',
    ctaHref: 'https://wa.me/923712524553',
    ctaStyle: 'primary',
  },
  {
    name: 'Enterprise',
    badge: null,
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    annualNote: 'Tailored to your scale · let\'s talk',
    desc: 'For chains, franchises, and brands with a real loyalty program.',
    posTag: 'Direct POS API — Square, Lightspeed, Toast',
    features: [
      'Unlimited card types & customers',
      'Direct POS API integration (Square, Lightspeed, Toast)',
      'Auto-stamp on payment — zero staff action',
      'Tiered memberships & VIP segments',
      'Custom CRM integrations',
      'Dedicated success manager',
      'SLA & onboarding workshop',
    ],
    cta: 'Talk to sales →',
    ctaStyle: 'outline',
  },
];

function PricingSection() {
  const [annual, setAnnual] = React.useState(true);
  return (
    <section className="lp-pricing" id="pricing">
      <div className="lp-pricing-inner">
        <div className="lp-pricing-header">
          <span className="lp-pricing-badge">✦ Simple pricing</span>
          <h2 className="lp-pricing-heading">Plans that grow with you</h2>
          <p className="lp-pricing-sub">Start free, scale when ready. No hidden fees.</p>
          <div className="lp-pricing-toggle">
            <span className={!annual ? 'lp-toggle-active' : ''}>Monthly</span>
            <button className={`lp-toggle-btn${annual ? ' lp-toggle-on' : ''}`} onClick={() => setAnnual(a => !a)} aria-label="Toggle billing">
              <span className="lp-toggle-thumb" />
            </button>
            <span className={annual ? 'lp-toggle-active' : ''}>Annual</span>
            {annual && <span className="lp-toggle-save">SAVE UP TO 33%</span>}
          </div>
        </div>
        <div className="lp-pricing-grid">
          {PLANS.map(p => (
            <div key={p.name} className={`lp-plan${p.ctaStyle === 'primary' ? ' lp-plan--featured' : ''}`}>
              {p.badge && <span className="lp-plan-badge">{p.badge}</span>}
              <div className="lp-plan-top">
                <p className="lp-plan-name">{p.name}</p>
                <div className="lp-plan-price">
                  <span className="lp-plan-amount">{annual ? p.annualPrice : p.monthlyPrice}</span>
                  {p.monthlyPrice !== 'Custom' && <span className="lp-plan-period">/month</span>}
                </div>
                <p className="lp-plan-note">{annual ? p.annualNote : 'Billed monthly'}</p>
                <p className="lp-plan-desc">{p.desc}</p>
                <span className="lp-plan-pos-tag">🔌 {p.posTag}</span>
              </div>
              <ul className="lp-plan-features">
                {p.features.map(f => (
                  <li key={f} className="lp-plan-feature">
                    <span className="lp-plan-check">✓</span>{f}
                  </li>
                ))}
              </ul>
              {p.ctaHref
                ? <a href={p.ctaHref} target="_blank" rel="noreferrer" className={`lp-plan-cta${p.ctaStyle === 'primary' ? ' lp-plan-cta--primary' : ''}`}>{p.cta}</a>
                : <Link to="/signup" className={`lp-plan-cta${p.ctaStyle === 'primary' ? ' lp-plan-cta--primary' : ''}`}>{p.cta}</Link>
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [statIdx, setStatIdx] = React.useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const t = setInterval(() => setStatIdx(i => (i + 1) % HERO_STATS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="lp">
      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="lp-mobile-menu">
          <button className="lp-mobile-close" onClick={closeMenu} aria-label="Close menu">×</button>
          <a href="#features" className="lp-mobile-link" onClick={closeMenu}>Features</a>
          <a href="#how" className="lp-mobile-link" onClick={closeMenu}>How it works</a>
          <a href="https://wa.me/923712524553" target="_blank" rel="noreferrer" className="lp-mobile-cta" onClick={closeMenu}>Book a demo</a>
        </div>
      )}

      {/* Nav */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <img src="/decidr-logo.png" alt="decidr" className="lp-logo-img" />
            <span className="lp-logo-badge">loyalty</span>
          </div>
          <div className="lp-nav-links">
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#how" className="lp-nav-link">How it works</a>
            <a href="https://wa.me/923712524553" target="_blank" rel="noreferrer" className="lp-btn lp-btn-sm">Book a demo</a>
          </div>
          <button className="lp-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <WavyLines />
        <div className="lp-hero-content">
          {/* Left: text */}
          <div className="lp-hero-inner">
            <p className="lp-hero-eyebrow">Digital Loyalty Card</p>
            <h1 className="lp-hero-title">
              The <span className="lp-accent">#1 Digital Loyalty Card</span><br />
              for Local Businesses
            </h1>
            <p className="lp-hero-sub">
              Boost customer retention and increase visit frequency with a branded{' '}
              <strong>digital stamp card</strong> that lives in your customers' Apple and Google Wallets.
            </p>
            <p key={statIdx} className="lp-hero-stat lp-stat-anim">
              Upto <span className="lp-stat-accent">{HERO_STATS[statIdx]}</span>
            </p>
            <div className="lp-hero-cta">
              <a href="https://wa.me/923712524553" target="_blank" rel="noreferrer" className="lp-btn lp-btn-primary">Book a demo</a>
            </div>
          </div>
          {/* Right: phone mockup */}
          <div className="lp-hero-right">
            <PhoneMockup />
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* How it works */}
      <section className="lp-how" id="how">
        <div className="lp-how-inner">
          <div className="lp-how-header">
            <span className="lp-how-badge">✦ Simple process</span>
            <h2 className="lp-how-title">How it works</h2>
            <p className="lp-how-sub">From setup to your first loyal customer in under 10 minutes.</p>
          </div>
          <div className="lp-how-steps">
            {HOW.map((h, i) => (
              <div key={h.step} className="lp-how-step">
                {i < HOW.length - 1 && <div className="lp-how-connector" />}
                <div className="lp-how-card">
                  <div className="lp-how-num">{h.step}</div>
                  <h3 className="lp-how-step-title">{h.title}</h3>
                  <p className="lp-how-desc">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CardTypesSection />

      {/* Pricing */}
      <PricingSection />

      {/* CTA */}

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          {/* Brand col */}
          <div className="lp-footer-brand">
            <div className="lp-footer-logo">
              <img src="/decidr-logo.png" alt="decidr" className="lp-footer-logo-img" />
              <span className="lp-footer-logo-badge">loyalty</span>
            </div>
            <p className="lp-footer-tagline">Digital loyalty cards for cafes and local businesses. No app needed — just scan and earn.</p>
            <div className="lp-footer-socials">
              <a href="#" className="lp-footer-social" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="lp-footer-social" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </a>
              <a href="#" className="lp-footer-social" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="lp-footer-social" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lp-footer-col">
            <h4 className="lp-footer-col-title">Quick Links</h4>
            <ul className="lp-footer-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="https://wa.me/923712524553" target="_blank" rel="noreferrer">Book a demo</a></li>
              <li><Link to="/login">Log in</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lp-footer-col">
            <h4 className="lp-footer-col-title">Contact Us</h4>
            <ul className="lp-footer-contact">
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Lahore, Pakistan
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.58 4.93 2 2 0 0 1 3.55 2.73h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 5.69 5.69l.88-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.27 17.5z"/></svg>
                +92 371 2524553
              </li>
            </ul>
          </div>

        </div>

        <div className="lp-footer-bottom">
          <span>© 2026 decidr™ · All rights reserved</span>
          <span>
            <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none', marginRight: '1rem' }}>Privacy Policy</Link>
            <Link to="/terms"   style={{ color: 'inherit', textDecoration: 'none' }}>Terms &amp; Conditions</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
