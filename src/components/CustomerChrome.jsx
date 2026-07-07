import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, Gift, Home, QrCode, UserRound } from 'lucide-react';
import './CustomerChrome.css';

export function CustomerBackButton({ fallback = '/customer', label = 'Back' }) {
  const navigate = useNavigate();

  function goBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate(fallback);
  }

  return (
    <button type="button" className="customer-back-btn" onClick={goBack} aria-label={label}>
      <ArrowLeft size={22} strokeWidth={2.4} />
    </button>
  );
}

export function CustomerBottomNav({ active = 'home', onReward }) {
  const items = [
    { id: 'home', Icon: Home, label: 'Home', href: '/customer' },
    { id: 'explore', Icon: Compass, label: 'Explore', href: '/' },
    { id: 'reward', Icon: Gift, label: 'Reward', onClick: onReward },
    { id: 'profile', Icon: UserRound, label: 'Profile', href: '/customer' },
  ];

  function renderItem(item) {
    const content = (
      <>
        <item.Icon size={24} strokeWidth={2.25} />
        {item.label}
      </>
    );
    const className = `sp-tab-item${active === item.id ? ' active' : ''}`;

    if (item.href) {
      return <Link key={item.id} to={item.href} className={className}>{content}</Link>;
    }

    return (
      <button key={item.id} type="button" className={className} onClick={item.onClick}>
        {content}
      </button>
    );
  }

  return (
    <nav className="sp-tabbar" aria-label="Customer navigation">
      <div className="sp-tabbar-side">
        {items.slice(0, 2).map(renderItem)}
      </div>
      <Link to="/customer" className="sp-scan-fab" aria-label="Scan or add QR card">
        <QrCode size={30} strokeWidth={2.4} />
      </Link>
      <div className="sp-tabbar-side">
        {items.slice(2).map(renderItem)}
      </div>
    </nav>
  );
}
