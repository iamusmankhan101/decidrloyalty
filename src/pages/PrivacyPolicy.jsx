import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link to="/" className="legal-logo">
          <img src="/decidr-logo.png" alt="decidr" className="legal-logo-img" />
          <span className="legal-logo-badge">loyalty</span>
        </Link>
        <Link to="/" className="legal-back">← Back to Home</Link>
      </header>

      <main className="legal-main">
        <div className="legal-inner">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last updated: June 24, 2026</p>

          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>Decidr Loyalty ("we", "us", or "our") operates the decidr loyalty platform, a digital loyalty card service for cafes and local businesses. This Privacy Policy explains how we collect, use, and protect information when you use our platform.</p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <h3>From Business Owners</h3>
            <ul>
              <li>Name, email address, and phone number during account registration</li>
              <li>Business name, logo, and brand details for loyalty card customization</li>
              <li>Billing and payment information (processed securely by third-party providers)</li>
            </ul>
            <h3>From Customers (via your loyalty program)</h3>
            <ul>
              <li>Phone number used to identify a loyalty card</li>
              <li>Stamp and visit history tied to their card</li>
              <li>Wallet pass data (Apple Wallet / Google Wallet) — managed by Apple and Google respectively</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>To create and manage your loyalty program and digital cards</li>
              <li>To issue stamps, track rewards, and send push notifications</li>
              <li>To provide analytics and usage reports to business owners</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send product updates and support communications</li>
              <li>To improve and develop our platform</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Data Sharing</h2>
            <p>We do not sell your personal data. We may share data with:</p>
            <ul>
              <li><strong>Service providers</strong> — hosting, payment processing, and email services that help us operate the platform</li>
              <li><strong>Apple / Google</strong> — wallet pass data is governed by their respective privacy policies</li>
              <li><strong>Legal authorities</strong> — if required by law or to protect our legal rights</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Data Retention</h2>
            <p>We retain business account data for as long as your account is active. Customer loyalty data is retained for the duration of your business subscription. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section className="legal-section">
            <h2>6. Security</h2>
            <p>We use industry-standard encryption and security practices to protect your data. However, no system is completely secure and we cannot guarantee absolute security.</p>
          </section>

          <section className="legal-section">
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for marketing communications at any time</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Cookies</h2>
            <p>We use essential cookies to keep you logged in and to remember your preferences. We do not use third-party advertising cookies.</p>
          </section>

          <section className="legal-section">
            <h2>9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>Phone: +92 371 2524553</li>
              <li>Address: Lahore, Pakistan</li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="legal-footer">
        <p>© 2026 decidr™ · All rights reserved · <Link to="/privacy">Privacy Policy</Link> · <Link to="/terms">Terms &amp; Conditions</Link></p>
      </footer>
    </div>
  );
}
