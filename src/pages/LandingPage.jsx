import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

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

const SCROLL_PER_CARD = 140;

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

export default function LandingPage() {
  const [statIdx, setStatIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setStatIdx(i => (i + 1) % HERO_STATS.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="lp">
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
            <Link to="/login"  className="lp-nav-link">Log in</Link>
            <Link to="/signup" className="lp-btn lp-btn-sm">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-lines" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => <span key={i} className="lp-line" />)}
        </div>
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
              <Link to="/signup" className="lp-btn lp-btn-primary">Start free trial</Link>
              <span className="lp-hero-or">OR</span>
              <Link to="/login" className="lp-btn lp-btn-dark">Book a demo</Link>
            </div>
            <p className="lp-hero-note">14-days free trial. No credit card required.</p>
          </div>
          {/* Right: phone mockup */}
          <div className="lp-hero-right">
            <PhoneMockup />
          </div>
        </div>
        {/* Trusted strip */}
        <div className="lp-trusted">
          <p className="lp-trusted-label">Trusted by many companies</p>
          <div className="lp-trusted-logos">
            <span className="lp-trusted-logo">SocialPilot</span>
            <span className="lp-trusted-logo">Adobe</span>
            <span className="lp-trusted-logo">TouchBistro</span>
            <span className="lp-trusted-logo">Google</span>
          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* How it works */}
      <section className="lp-how" id="how">
        <div className="lp-section-inner">
          <h2 className="lp-section-title">How it works</h2>
          <p className="lp-section-sub">From setup to your first loyal customer in under 10 minutes.</p>
          <div className="lp-how-steps">
            {HOW.map(h => (
              <div key={h.step} className="lp-how-step">
                <div className="lp-how-num">{h.step}</div>
                <h3 className="lp-how-title">{h.title}</h3>
                <p className="lp-how-desc">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta">
        <div className="lp-section-inner lp-cta-inner">
          <h2 className="lp-cta-title">Ready to build a loyal customer base?</h2>
          <p className="lp-cta-sub">Join cafes already using decidr loyalty to retain customers.</p>
          <Link to="/signup" className="lp-btn lp-btn-lg lp-btn-white">Create your loyalty program →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <span>© 2026 decidr™ · All rights reserved</span>
        <span>Built for cafes by <a href="https://trydecidr.xyz" style={{ color: '#6366f1' }}>decidr</a></span>
      </footer>
    </div>
  );
}
