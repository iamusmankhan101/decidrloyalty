import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

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

export default function LandingPage() {
  return (
    <div className="lp">
      {/* Nav */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <span className="lp-logo">decidr <span className="lp-logo-badge">loyalty</span></span>
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
        <div className="lp-hero-inner">
          <div className="lp-hero-badge">🚀 Now with Google Wallet integration</div>
          <h1 className="lp-hero-title">
            Turn your cafe customers<br />into <span className="lp-accent">loyal regulars</span>
          </h1>
          <p className="lp-hero-sub">
            Digital stamp cards that live in Google Wallet. No app. No paper. No hassle.<br />
            Set up in 5 minutes and reward your best customers automatically.
          </p>
          <div className="lp-hero-cta">
            <Link to="/signup" className="lp-btn lp-btn-lg">Start for free →</Link>
            <Link to="/login"  className="lp-btn lp-btn-ghost-lg">Log in</Link>
          </div>
          <p className="lp-hero-note">Free to start · No credit card required</p>
        </div>

        {/* Pass preview */}
        <div className="lp-pass-preview">
          <div className="lp-pass">
            <div className="lp-pass-header">
              <span className="lp-pass-cafe">☕ Brew & Co.</span>
              <span className="lp-pass-label">Loyalty Card</span>
            </div>
            <div className="lp-pass-body">
              <p className="lp-pass-name">Ahmed Khan</p>
              <div className="lp-pass-stamps">
                {Array.from({ length: 9 }, (_, i) => (
                  <span key={i} className={`lp-pass-dot${i < 6 ? ' filled' : ''}`} />
                ))}
              </div>
              <p className="lp-pass-progress">6 / 9 stamps · 3 more for a free coffee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="lp-features" id="features">
        <div className="lp-section-inner">
          <h2 className="lp-section-title">Everything your cafe needs</h2>
          <p className="lp-section-sub">Built specifically for independent cafes and small coffee shops.</p>
          <div className="lp-features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="lp-feature-card">
                <span className="lp-feature-icon">{f.icon}</span>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
