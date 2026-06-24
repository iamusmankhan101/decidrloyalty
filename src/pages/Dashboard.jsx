import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const API = '/api/loyalty';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [tab, setTab]           = useState('setup');

  // Setup
  const [program, setProgram]     = useState(null);
  const [form, setForm]           = useState({ primaryColor: '#6366f1', logoUrl: '', rewardName: 'Free Coffee', stampsRequired: 9, active: true });
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState('');

  // Customers
  const [customers, setCustomers] = useState([]);
  const [stats, setStats]         = useState(null);
  const [custLoading, setCustLoading] = useState(false);
  const [search, setSearch]       = useState('');

  const rid = user?.restaurantId;

  // Load program on mount
  useEffect(() => {
    if (!rid) return;
    fetch(`${API}?action=program&restaurantId=${rid}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.program) {
          setProgram(data.program);
          setForm({
            primaryColor:   data.program.primaryColor   || '#6366f1',
            logoUrl:        data.program.logoUrl        || '',
            rewardName:     data.program.rewardName     || 'Free Coffee',
            stampsRequired: data.program.stampsRequired || 9,
            active:         !!data.program.active,
          });
        }
      });
  }, [rid]);

  const loadCustomers = useCallback(() => {
    if (!rid) return;
    setCustLoading(true);
    fetch(`${API}?action=customers&restaurantId=${rid}`)
      .then(r => r.ok ? r.json() : { customers: [], stats: null })
      .then(data => { setCustomers(data.customers || []); setStats(data.stats || null); })
      .finally(() => setCustLoading(false));
  }, [rid]);

  useEffect(() => { if (tab === 'customers' || tab === 'stats') loadCustomers(); }, [tab, loadCustomers]);

  async function saveProgram() {
    setSaving(true); setSaveMsg('');
    try {
      const res = await fetch(`${API}?action=setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId: rid, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(err.message);
    } finally {
      setSaving(false);
    }
  }

  const stampUrl = `https://loyalty.trydecidr.xyz/stamp/${user?.slug || rid}`;
  const qrUrl    = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(stampUrl)}`;

  const filtered = customers.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search)
  );

  return (
    <div className="db">
      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="db-brand">decidr <span className="db-brand-badge">loyalty</span></div>
        <nav className="db-nav">
          {[
            { id: 'setup',     icon: '⚙️',  label: 'Setup'     },
            { id: 'customers', icon: '👥',  label: 'Customers' },
            { id: 'stats',     icon: '📊',  label: 'Stats'     },
          ].map(t => (
            <button key={t.id} className={`db-nav-item${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              <span className="db-nav-icon">{t.icon}</span> {t.label}
            </button>
          ))}
        </nav>
        <button className="db-logout" onClick={logout}>Log out</button>
      </aside>

      {/* Main */}
      <main className="db-main">

        {/* ── SETUP TAB ── */}
        {tab === 'setup' && (
          <div className="db-content">
            <div className="db-header">
              <h1 className="db-title">Loyalty Program Setup</h1>
              <p className="db-subtitle">Configure your digital stamp card and get your QR code.</p>
            </div>

            <div className="db-grid-2">
              {/* Settings form */}
              <div className="db-card">
                <h2 className="db-card-title">Program Settings</h2>

                <div className="db-field">
                  <label className="db-label">Reward Name</label>
                  <input className="db-input" value={form.rewardName}
                    onChange={e => setForm(f => ({ ...f, rewardName: e.target.value }))}
                    placeholder="e.g. Free Coffee" />
                  <span className="db-hint">Shown to customers when they earn a reward</span>
                </div>

                <div className="db-field">
                  <label className="db-label">Stamps Required</label>
                  <input className="db-input" type="number" min={3} max={20} value={form.stampsRequired}
                    onChange={e => setForm(f => ({ ...f, stampsRequired: Number(e.target.value) }))} />
                  <span className="db-hint">How many stamps to earn the reward</span>
                </div>

                <div className="db-field">
                  <label className="db-label">Brand Color</label>
                  <div className="db-color-row">
                    <input type="color" value={form.primaryColor}
                      onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                      className="db-color-picker" />
                    <input className="db-input" value={form.primaryColor}
                      onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                      placeholder="#6366f1" style={{ flex: 1 }} />
                  </div>
                </div>

                <div className="db-field">
                  <label className="db-label">Logo URL <span className="db-optional">(optional)</span></label>
                  <input className="db-input" value={form.logoUrl}
                    onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                    placeholder="https://your-cafe.com/logo.png" />
                </div>

                <div className="db-field db-field-row">
                  <label className="db-label" style={{ marginBottom: 0 }}>Active</label>
                  <label className="db-toggle">
                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                    <span className="db-toggle-slider" />
                  </label>
                </div>

                <div className="db-save-row">
                  <button className="db-btn-primary" onClick={saveProgram} disabled={saving}>
                    {saving ? 'Saving…' : 'Save Program'}
                  </button>
                  {saveMsg && <span className={`db-save-msg${saveMsg === 'Saved!' ? ' ok' : ' err'}`}>{saveMsg}</span>}
                </div>
              </div>

              {/* QR Code */}
              <div className="db-card db-qr-card">
                <h2 className="db-card-title">Your Stamp QR Code</h2>
                <p className="db-card-sub">Print and display this at your counter. Customers scan it to collect stamps.</p>
                <div className="db-qr-wrap">
                  <img src={qrUrl} alt="QR Code" className="db-qr-img" />
                </div>
                <p className="db-qr-url">{stampUrl}</p>
                <a href={qrUrl} download="loyalty-qr.png" className="db-btn-outline" style={{ display: 'inline-block', textAlign: 'center', marginTop: '0.75rem' }}>
                  Download QR Code
                </a>

                {/* Live pass preview */}
                <div className="db-pass-preview" style={{ background: form.primaryColor }}>
                  {form.logoUrl
                    ? <img src={form.logoUrl} alt="logo" className="db-pass-logo" />
                    : <span className="db-pass-cafe-name">Your Cafe</span>
                  }
                  <div className="db-pass-dots">
                    {Array.from({ length: form.stampsRequired }, (_, i) => (
                      <span key={i} className={`db-pass-dot${i < 3 ? ' filled' : ''}`} />
                    ))}
                  </div>
                  <p className="db-pass-reward">Earn {form.stampsRequired} stamps → {form.rewardName}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOMERS TAB ── */}
        {tab === 'customers' && (
          <div className="db-content">
            <div className="db-header">
              <h1 className="db-title">Customers</h1>
              <p className="db-subtitle">{customers.length} customer{customers.length !== 1 ? 's' : ''} registered</p>
            </div>

            <div className="db-card">
              <div className="db-table-toolbar">
                <input className="db-search" placeholder="Search by name or phone…" value={search}
                  onChange={e => setSearch(e.target.value)} />
                <button className="db-btn-outline" onClick={loadCustomers}>Refresh</button>
              </div>

              {custLoading ? (
                <div className="db-loading"><div className="db-spinner" /></div>
              ) : filtered.length === 0 ? (
                <div className="db-empty">
                  <p>No customers yet.</p>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.4rem' }}>Customers appear here after their first stamp.</p>
                </div>
              ) : (
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Stamps</th>
                      <th>Rewards</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => (
                      <tr key={c.id}>
                        <td className="db-td-name">{c.name || '—'}</td>
                        <td className="db-td-phone">{c.phone}</td>
                        <td>
                          <div className="db-mini-stamps">
                            {Array.from({ length: form.stampsRequired || 9 }, (_, i) => (
                              <span key={i} className={`db-mini-dot${i < c.stampCount ? ' filled' : ''}`} style={i < c.stampCount ? { background: form.primaryColor } : {}} />
                            ))}
                            <span className="db-stamp-count">{c.stampCount}/{form.stampsRequired || 9}</span>
                          </div>
                        </td>
                        <td><span className="db-reward-badge">{c.rewardCount || 0}</span></td>
                        <td className="db-td-date">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (
          <div className="db-content">
            <div className="db-header">
              <h1 className="db-title">Overview</h1>
              <p className="db-subtitle">Your loyalty program at a glance.</p>
            </div>

            <div className="db-stats-grid">
              {[
                { label: 'Total Customers', value: stats?.totalCustomers ?? '—', icon: '👥', color: '#6366f1' },
                { label: 'Total Stamps Issued', value: stats?.totalStamps ?? '—', icon: '⭐', color: '#f59e0b' },
                { label: 'Rewards Redeemed', value: stats?.totalRewards ?? '—', icon: '🎁', color: '#10b981' },
                { label: 'Stamps per Customer', value: stats?.totalCustomers ? (stats.totalStamps / stats.totalCustomers).toFixed(1) : '—', icon: '📈', color: '#3b82f6' },
              ].map(s => (
                <div key={s.label} className="db-stat-card">
                  <div className="db-stat-icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
                  <div className="db-stat-val">{s.value}</div>
                  <div className="db-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Top customers */}
            {customers.length > 0 && (
              <div className="db-card" style={{ marginTop: '1.5rem' }}>
                <h2 className="db-card-title">Top Regulars</h2>
                <table className="db-table">
                  <thead><tr><th>Name</th><th>Phone</th><th>Stamps</th><th>Rewards</th></tr></thead>
                  <tbody>
                    {[...customers].sort((a, b) => b.stampCount - a.stampCount).slice(0, 10).map(c => (
                      <tr key={c.id}>
                        <td className="db-td-name">{c.name || '—'}</td>
                        <td className="db-td-phone">{c.phone}</td>
                        <td><strong>{c.stampCount}</strong></td>
                        <td><span className="db-reward-badge">{c.rewardCount || 0}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
