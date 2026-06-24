import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPage.css';

export default function TermsAndConditions() {
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
          <h1 className="legal-title">Terms &amp; Conditions</h1>
          <p className="legal-updated">Last updated: June 24, 2026</p>

          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the Decidr Loyalty platform ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree, you may not use the Service.</p>
          </section>

          <section className="legal-section">
            <h2>2. Description of Service</h2>
            <p>Decidr Loyalty provides a digital loyalty card platform that allows businesses to create and manage branded stamp cards, cashback programs, memberships, and other reward types for their customers. Cards are delivered via Apple Wallet, Google Wallet, or QR code.</p>
          </section>

          <section className="legal-section">
            <h2>3. Account Registration</h2>
            <ul>
              <li>You must be at least 18 years old to create a business account</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials</li>
              <li>You agree to provide accurate and up-to-date information</li>
              <li>One business may operate multiple outlet locations under one account based on the applicable plan</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Subscription &amp; Payment</h2>
            <ul>
              <li>Subscriptions are billed monthly or annually as selected at checkout</li>
              <li>All prices are listed in PKR unless otherwise stated</li>
              <li>Annual plans are non-refundable after the first 7 days</li>
              <li>Monthly plans may be cancelled at any time; access continues until the end of the billing period</li>
              <li>We reserve the right to update pricing with 30 days' advance notice</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the platform for any unlawful purpose or in violation of these Terms</li>
              <li>Issue fraudulent stamps or rewards to circumvent the system</li>
              <li>Reverse-engineer, copy, or replicate any part of the platform</li>
              <li>Use the Service to send unsolicited or spam communications to customers</li>
              <li>Share your account credentials with unauthorized third parties</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Customer Data</h2>
            <p>As a business using our platform, you are the data controller for your customers' information collected through your loyalty program. You are responsible for ensuring you have appropriate consent from your customers to collect and process their data in accordance with applicable laws.</p>
          </section>

          <section className="legal-section">
            <h2>7. Intellectual Property</h2>
            <p>All platform features, designs, and software are the intellectual property of Decidr Loyalty. Your business logo and branding remain your property. By uploading your branding, you grant us a limited license to display it within your loyalty cards and dashboard.</p>
          </section>

          <section className="legal-section">
            <h2>8. Service Availability</h2>
            <p>We aim for 99.9% uptime but do not guarantee uninterrupted access. Scheduled maintenance will be communicated in advance. We are not liable for any losses resulting from service downtime beyond our reasonable control.</p>
          </section>

          <section className="legal-section">
            <h2>9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Decidr Loyalty shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including lost revenue, lost customer data, or business interruption.</p>
          </section>

          <section className="legal-section">
            <h2>10. Termination</h2>
            <p>We reserve the right to suspend or terminate your account if you violate these Terms. You may cancel your subscription at any time through your dashboard. Upon termination, your data will be retained for 30 days before permanent deletion.</p>
          </section>

          <section className="legal-section">
            <h2>11. Changes to Terms</h2>
            <p>We may update these Terms from time to time. We will notify you by email or via the platform at least 14 days before significant changes take effect. Continued use of the Service after that date constitutes acceptance of the updated Terms.</p>
          </section>

          <section className="legal-section">
            <h2>12. Governing Law</h2>
            <p>These Terms are governed by the laws of Pakistan. Any disputes shall be resolved in the courts of Lahore, Pakistan.</p>
          </section>

          <section className="legal-section">
            <h2>13. Contact Us</h2>
            <p>For any questions about these Terms, please reach out:</p>
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
