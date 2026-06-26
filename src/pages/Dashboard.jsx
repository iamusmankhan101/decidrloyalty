import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Settings2, Users, BarChart3 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const API = '/api/loyalty';

/* ─── Scan Tab ─────────────────────────────────────────────── */
function ScanTab({ rid, token, program }) {
  const [phone, setPhone]     = useState('');
  const [stamping, setStamping] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');
  const inputRef = useRef(null);
  const stampsRequired = program?.stampsRequired || 9;

  useEffect(() => { inputRef.current?.focus(); }, []);

  function reset() {
    setPhone(''); setResult(null); setError('');
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  async function handleStamp(e) {
    e.preventDefault();
    if (!phone.trim()) return;
    setStamping(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${API}?action=stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId: rid, phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add stamp');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setStamping(false);
    }
  }

  async function redeemReward() {
    try {
      await fetch(`${API}?action=redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId: rid, phone: phone.trim() }),
      });
    } catch {}
    reset();
  }

  if (result?.rewarded) {
    return (
      <div className="db-content db-scan-content">
        <div className="db-reward-screen">
          <div className="db-reward-burst">🎉</div>
          <h2 className="db-reward-title">Reward Earned!</h2>
          <p className="db-reward-sub">
            <strong>{result.customer?.name || result.customer?.phone}</strong> has earned a free <strong>{program?.rewardName || 'reward'}</strong>!
          </p>
          <div className="db-reward-actions">
            <button className="db-btn-primary db-btn-lg" onClick={redeemReward}>
              ✓ Mark as Redeemed
            </button>
            <button className="db-btn-outline" onClick={reset}>Skip</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="db-content db-scan-content">
      <div className="db-header">
        <h1 className="db-title">Stamp a Customer</h1>
        <p className="db-subtitle">Enter the customer's phone number to add a stamp.</p>
      </div>

      <form className="db-scan-form" onSubmit={handleStamp}>
        <input
          ref={inputRef}
          className="db-scan-input"
          type="tel"
          placeholder="03XX XXXXXXX"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          inputMode="numeric"
          autoComplete="off"
        />
        {error && <p className="db-scan-error">{error}</p>}
        <button
          className="db-btn-primary db-btn-lg db-scan-btn"
          type="submit"
          disabled={stamping || !phone.trim()}
        >
          {stamping ? 'Adding stamp…' : '＋ Add Stamp'}
        </button>
      </form>

      {result && !result.rewarded && (
        <div className="db-scan-result">
          <div className="db-scan-customer-row">
            <div className="db-scan-avatar"
              style={{ background: program?.primaryColor || '#ff0000' }}>
              {(result.customer?.name?.[0] || result.customer?.phone?.[0] || '?').toUpperCase()}
            </div>
            <div>
              <p className="db-scan-name">{result.customer?.name || 'Customer'}</p>
              <p className="db-scan-phone">{result.customer?.phone}</p>
            </div>
          </div>
          <div className="db-scan-dots">
            {Array.from({ length: stampsRequired }, (_, i) => (
              <span
                key={i}
                className={`db-scan-dot${i < result.stampCount ? ' filled' : ''}`}
                style={i < result.stampCount ? { background: program?.primaryColor || '#ff0000', borderColor: program?.primaryColor || '#ff0000' } : {}}
              />
            ))}
          </div>
          <p className="db-scan-progress">
            <strong>{result.stampCount}</strong> / {stampsRequired} stamps
            &nbsp;·&nbsp;
            {stampsRequired - result.stampCount > 0
              ? `${stampsRequired - result.stampCount} more for ${program?.rewardName || 'reward'}`
              : `${program?.rewardName || 'Reward'} ready!`}
          </p>
          <button className="db-btn-outline db-scan-next" onClick={reset}>
            Next Customer →
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Setup Tab ─────────────────────────────────────────────── */
function SetupTab({ rid, token, form, setForm, program, saving, saveMsg, saveProgram }) {
  const stampUrl = `https://loyalty.trydecidr.xyz/stamp/${program?.slug || rid}`;
  const qrCanvasRef = useRef(null);

  function downloadQR() {
    const canvas = qrCanvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loyalty-qr.png';
    a.click();
  }

  return (
    <div className="db-content">
      <div className="db-header">
        <h1 className="db-title">Program Setup</h1>
        <p className="db-subtitle">Configure your loyalty program and download your QR code.</p>
      </div>

      <div className="db-grid-2">
        {/* Settings */}
        <div className="db-card">
          <h2 className="db-card-title">Program Settings</h2>

          <div className="db-field">
            <label className="db-label">Reward Name</label>
            <input className="db-input" value={form.rewardName}
              onChange={e => setForm(f => ({ ...f, rewardName: e.target.value }))}
              placeholder="e.g. Free Coffee" />
            <span className="db-hint">What customers earn after completing stamps</span>
          </div>

          <div className="db-field">
            <label className="db-label">Stamps Required</label>
            <input className="db-input" type="number" min={3} max={20}
              value={form.stampsRequired}
              onChange={e => setForm(f => ({ ...f, stampsRequired: Number(e.target.value) }))} />
            <span className="db-hint">Stamps needed to earn the reward</span>
          </div>

          <div className="db-field">
            <label className="db-label">Brand Color</label>
            <div className="db-color-row">
              <input type="color" value={form.primaryColor}
                onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                className="db-color-picker" />
              <input className="db-input" value={form.primaryColor}
                onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                placeholder="#ff0000" style={{ flex: 1 }} />
            </div>
          </div>

          <div className="db-field">
            <label className="db-label">Logo URL <span className="db-optional">(optional)</span></label>
            <input className="db-input" value={form.logoUrl}
              onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
              placeholder="https://your-cafe.com/logo.png" />
          </div>

          <div className="db-field db-field-row">
            <label className="db-label" style={{ marginBottom: 0 }}>Program Active</label>
            <label className="db-toggle">
              <input type="checkbox" checked={form.active}
                onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
              <span className="db-toggle-slider" />
            </label>
          </div>

          <div className="db-save-row">
            <button className="db-btn-primary" onClick={saveProgram} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            {saveMsg && (
              <span className={`db-save-msg${saveMsg === 'Saved!' ? ' ok' : ' err'}`}>{saveMsg}</span>
            )}
          </div>
        </div>

        {/* QR Code */}
        <div className="db-card db-qr-card">
          <h2 className="db-card-title">Your Stamp QR Code</h2>
          <p className="db-card-sub">Print and place this at your counter. Customers scan it to collect stamps — no app needed.</p>
          <div className="db-qr-wrap" ref={qrCanvasRef}>
            <QRCodeCanvas value={stampUrl} size={240} includeMargin={true} />
          </div>
          <p className="db-qr-url">{stampUrl}</p>
          <button className="db-btn-outline"
            style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '0.75rem', cursor: 'pointer' }}
            onClick={downloadQR}>
            ↓ Download QR Code
          </button>

          {/* Card preview */}
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
  );
}

/* ─── Customers Tab ─────────────────────────────────────────── */
function CustomersTab({ customers, custLoading, loadCustomers, search, setSearch, stampsRequired, primaryColor }) {
  const filtered = customers.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search)
  );

  return (
    <div className="db-content">
      <div className="db-header">
        <h1 className="db-title">Customers</h1>
        <p className="db-subtitle">{customers.length} customer{customers.length !== 1 ? 's' : ''} registered</p>
      </div>

      <div className="db-card">
        <div className="db-table-toolbar">
          <input className="db-search" placeholder="Search by name or phone…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <button className="db-btn-outline" onClick={loadCustomers}>↻ Refresh</button>
        </div>

        {custLoading ? (
          <div className="db-loading"><div className="db-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="db-empty">
            <p className="db-empty-icon">👥</p>
            <p>No customers yet.</p>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.4rem' }}>
              Customers appear here after their first stamp.
            </p>
          </div>
        ) : (
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Stamps</th>
                  <th>Rewards</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div className="db-cust-row">
                        <div className="db-cust-avatar" style={{ background: primaryColor || '#ff0000' }}>
                          {(c.name?.[0] || c.phone?.[0] || '?').toUpperCase()}
                        </div>
                        <span className="db-td-name">{c.name || '—'}</span>
                      </div>
                    </td>
                    <td className="db-td-phone">{c.phone}</td>
                    <td>
                      <div className="db-mini-stamps">
                        {Array.from({ length: stampsRequired || 9 }, (_, i) => (
                          <span key={i}
                            className={`db-mini-dot${i < c.stampCount ? ' filled' : ''}`}
                            style={i < c.stampCount ? { background: primaryColor || '#ff0000', borderColor: primaryColor || '#ff0000' } : {}}
                          />
                        ))}
                        <span className="db-stamp-count">{c.stampCount}/{stampsRequired || 9}</span>
                      </div>
                    </td>
                    <td>
                      {c.rewardCount > 0
                        ? <span className="db-reward-badge">{c.rewardCount} 🎁</span>
                        : <span className="db-reward-badge zero">0</span>}
                    </td>
                    <td className="db-td-date">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Stats Tab ─────────────────────────────────────────────── */
function StatsTab({ stats, customers }) {
  const topCustomers = [...customers].sort((a, b) => b.stampCount - a.stampCount).slice(0, 10);

  return (
    <div className="db-content">
      <div className="db-header">
        <h1 className="db-title">Analytics</h1>
        <p className="db-subtitle">Your loyalty program at a glance.</p>
      </div>

      <div className="db-stats-grid">
        {[
          { label: 'Total Customers',    value: stats?.totalCustomers  ?? '—', icon: '👥', color: '#022a8a' },
          { label: 'Stamps Issued',      value: stats?.totalStamps     ?? '—', icon: '⭐', color: '#f59e0b' },
          { label: 'Rewards Redeemed',   value: stats?.totalRewards    ?? '—', icon: '🎁', color: '#10b981' },
          { label: 'Avg Stamps / Customer',
            value: stats?.totalCustomers
              ? (stats.totalStamps / stats.totalCustomers).toFixed(1)
              : '—',
            icon: '📈', color: '#ff0000' },
        ].map(s => (
          <div key={s.label} className="db-stat-card">
            <div className="db-stat-icon" style={{ background: s.color + '18', color: s.color }}>{s.icon}</div>
            <div className="db-stat-val">{s.value}</div>
            <div className="db-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {topCustomers.length > 0 && (
        <div className="db-card" style={{ marginTop: '1.5rem' }}>
          <h2 className="db-card-title">🏆 Top Regulars</h2>
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr><th>#</th><th>Customer</th><th>Phone</th><th>Stamps</th><th>Rewards</th></tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={c.id}>
                    <td className="db-rank">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </td>
                    <td className="db-td-name">{c.name || '—'}</td>
                    <td className="db-td-phone">{c.phone}</td>
                    <td><strong>{c.stampCount}</strong></td>
                    <td><span className="db-reward-badge">{c.rewardCount || 0} 🎁</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
const TABS = [
  { id: 'scan',      Icon: Camera,   label: 'Scan'      },
  { id: 'setup',     Icon: Settings2, label: 'Setup'     },
  { id: 'customers', Icon: Users,    label: 'Customers' },
  { id: 'stats',     Icon: BarChart3, label: 'Analytics' },
];

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [tab, setTab] = useState('scan');

  const [program, setProgram] = useState(null);
  const [form, setForm] = useState({
    primaryColor: '#ff0000',
    logoUrl: '',
    rewardName: 'Free Coffee',
    stampsRequired: 9,
    active: true,
  });
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [customers, setCustomers]   = useState([]);
  const [stats, setStats]           = useState(null);
  const [custLoading, setCustLoading] = useState(false);
  const [search, setSearch]         = useState('');

  const rid = user?.restaurantId;

  useEffect(() => {
    if (!rid) return;
    fetch(`${API}?action=program&restaurantId=${rid}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.program) {
          setProgram(data.program);
          setForm({
            primaryColor:   data.program.primaryColor   || '#ff0000',
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

  useEffect(() => {
    if (tab === 'customers' || tab === 'stats') loadCustomers();
  }, [tab, loadCustomers]);

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
      setProgram(p => ({ ...p, ...form }));
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="db">
      {/* ── Sidebar (desktop) ── */}
      <aside className="db-sidebar">
        <div className="db-brand">
          <span className="db-brand-name">decidr</span>
          <span className="db-brand-badge">loyalty</span>
        </div>

        <nav className="db-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`db-nav-item${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="db-nav-icon"><t.Icon size={18} strokeWidth={1.75} /></span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <div className="db-user-info">
            <div className="db-user-avatar">{(user?.email?.[0] || 'U').toUpperCase()}</div>
            <div className="db-user-meta">
              <p className="db-user-email">{user?.email}</p>
              <p className="db-user-role">Owner</p>
            </div>
          </div>
          <button className="db-logout" onClick={logout}>Log out</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="db-main">
        {tab === 'scan' && (
          <ScanTab rid={rid} token={token} program={program} />
        )}
        {tab === 'setup' && (
          <SetupTab
            rid={rid} token={token}
            form={form} setForm={setForm}
            program={program}
            saving={saving} saveMsg={saveMsg}
            saveProgram={saveProgram}
          />
        )}
        {tab === 'customers' && (
          <CustomersTab
            customers={customers}
            custLoading={custLoading}
            loadCustomers={loadCustomers}
            search={search} setSearch={setSearch}
            stampsRequired={form.stampsRequired}
            primaryColor={form.primaryColor}
          />
        )}
        {tab === 'stats' && (
          <StatsTab stats={stats} customers={customers} />
        )}
      </main>

      {/* ── Bottom nav (mobile) ── */}
      <nav className="db-bottom-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`db-bottom-item${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="db-bottom-icon"><t.Icon size={22} strokeWidth={1.75} /></span>
            <span className="db-bottom-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
