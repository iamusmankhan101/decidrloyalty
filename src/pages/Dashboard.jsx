import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Settings2, Users, BarChart3, Zap, Banknote } from 'lucide-react';
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
  const stampUrl = `https://loyalty.trydecidr.xyz/stamp/${rid}`;
  const qrCanvasRef = useRef(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState('');

  function downloadQR() {
    const canvas = qrCanvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loyalty-qr.png';
    a.click();
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setLogoError('');
    try {
      const sigRes = await fetch('/api/cloudinary-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'logo' }),
      });
      if (!sigRes.ok) throw new Error('Could not get upload signature');
      const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { secure_url } = await uploadRes.json();

      setForm(f => ({ ...f, logoUrl: secure_url }));

      // Auto-save so the logo persists on refresh and shows on the stamp page
      await fetch('/api/loyalty?action=setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId: rid, ...form, logoUrl: secure_url }),
      });
    } catch (err) {
      setLogoError(err.message);
    } finally {
      setLogoUploading(false);
    }
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
            <label className="db-label">Logo <span className="db-optional">(optional)</span></label>
            <div className="db-logo-upload">
              {form.logoUrl && (
                <div className="db-logo-preview-wrap">
                  <img src={form.logoUrl} alt="logo preview" className="db-logo-preview" />
                  <button type="button" className="db-logo-remove"
                    onClick={() => {
                      setForm(f => ({ ...f, logoUrl: '' }));
                      fetch('/api/loyalty?action=setup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ restaurantId: rid, ...form, logoUrl: '' }),
                      });
                    }}>✕</button>
                </div>
              )}
              <label className={`db-logo-label${logoUploading ? ' uploading' : ''}`}>
                <input type="file" accept="image/*" className="db-logo-input"
                  onChange={handleLogoUpload} disabled={logoUploading} />
                {logoUploading ? 'Uploading…' : form.logoUrl ? '↑ Replace logo' : '↑ Upload logo'}
              </label>
            </div>
            {logoError && <span className="db-hint" style={{ color: '#ef4444' }}>{logoError}</span>}
            <span className="db-hint">PNG or JPG, displayed on your stamp card</span>
          </div>

          <div className="db-field">
            <label className="db-label">Staff PIN <span className="db-optional">(recommended)</span></label>
            <input
              className="db-input"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={form.staffPin}
              onChange={e => setForm(f => ({ ...f, staffPin: e.target.value.replace(/\D/g, '') }))}
              placeholder="e.g. 1234"
              autoComplete="off"
            />
            <span className="db-hint">
              {program?.staffPin
                ? 'PIN is active — enter a new value to change it, or leave blank to remove it.'
                : 'Staff must enter this PIN to add a stamp. Leave blank to disable.'}
            </span>
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
                  <th></th>
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
                    <td style={{ width: 40, paddingRight: 0 }}>
                      <div className="db-cust-avatar" style={{ background: primaryColor || '#ff0000' }}>
                        {(c.name?.[0] || c.phone?.[0] || '?').toUpperCase()}
                      </div>
                    </td>
                    <td className="db-td-name">{c.name || <span style={{ color: '#94a3b8' }}>—</span>}</td>
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

/* ─── Cashback Tab ──────────────────────────────────────────── */
const CB_API = '/api/loyalty';

function CashbackTab({ rid, token }) {
  const [program, setProgram]     = useState(null);
  const [progLoading, setProgLoading] = useState(true);
  const [view, setView]           = useState('earn'); // 'earn' | 'redeem' | 'customers' | 'setup'

  // Cashback program setup form
  const [cbForm, setCbForm] = useState({ cashbackRate: 5, minSpendToEarn: 0, minBalanceToRedeem: 0, active: true });
  const [cbSaving, setCbSaving] = useState(false);
  const [cbSaveMsg, setCbSaveMsg] = useState('');

  // Earn state
  const [earnPhone, setEarnPhone]       = useState('');
  const [earnName, setEarnName]         = useState('');
  const [earnAmount, setEarnAmount]     = useState('');
  const [earnResult, setEarnResult]     = useState(null);
  const [earnError, setEarnError]       = useState('');
  const [earning, setEarning]           = useState(false);

  // Redeem state
  const [redeemPhone, setRedeemPhone]   = useState('');
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeemBalance, setRedeemBalance] = useState(null);
  const [checkingBal, setCheckingBal]   = useState(false);
  const [redeemResult, setRedeemResult] = useState(null);
  const [redeemError, setRedeemError]   = useState('');
  const [redeeming, setRedeeming]       = useState(false);
  const redeemPhoneRef = useRef(null);

  // Customers state
  const [cbCustomers, setCbCustomers]   = useState([]);
  const [cbStats, setCbStats]           = useState(null);
  const [cbCustLoading, setCbCustLoading] = useState(false);

  useEffect(() => {
    if (!rid) return;
    fetch(`${CB_API}?action=cashback-program&restaurantId=${rid}`)
      .then(r => r.ok ? r.json() : { program: null })
      .then(d => {
        if (d.program) {
          setProgram(d.program);
          setCbForm({
            cashbackRate:       d.program.cashbackRate       ?? 5,
            minSpendToEarn:     d.program.minSpendToEarn     ?? 0,
            minBalanceToRedeem: d.program.minBalanceToRedeem ?? 0,
            active:             !!d.program.active,
          });
        }
      })
      .finally(() => setProgLoading(false));
  }, [rid]);

  useEffect(() => {
    if (view === 'customers') loadCbCustomers();
  }, [view]);

  function loadCbCustomers() {
    setCbCustLoading(true);
    fetch(`${CB_API}?action=cashback-customers&restaurantId=${rid}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : { customers: [], stats: null })
      .then(d => { setCbCustomers(d.customers || []); setCbStats(d.stats || null); })
      .finally(() => setCbCustLoading(false));
  }

  async function saveCbProgram() {
    setCbSaving(true); setCbSaveMsg('');
    try {
      const res = await fetch(`${CB_API}?action=cashback-setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId: rid, ...cbForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProgram({ ...cbForm });
      setCbSaveMsg('Saved!');
      setTimeout(() => { setCbSaveMsg(''); setView('earn'); }, 1500);
    } catch (err) {
      setCbSaveMsg(err.message);
    } finally {
      setCbSaving(false);
    }
  }

  async function handleEarn(e) {
    e.preventDefault();
    if (!earnPhone.trim() || !earnAmount) return;
    setEarning(true); setEarnError(''); setEarnResult(null);
    try {
      const res = await fetch(`${CB_API}?action=cashback-earn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId: rid, phone: earnPhone.trim(), name: earnName.trim(), amountSpent: Number(earnAmount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEarnResult(data);
    } catch (err) {
      setEarnError(err.message);
    } finally {
      setEarning(false);
    }
  }

  function resetEarn() {
    setEarnPhone(''); setEarnName(''); setEarnAmount(''); setEarnResult(null); setEarnError('');
  }

  // Auto-lookup balance as phone is typed in redeem view
  const redeemPhoneCheckRef = useRef(null);
  function handleRedeemPhoneChange(val) {
    setRedeemPhone(val);
    setRedeemBalance(null); setRedeemResult(null); setRedeemError('');
    clearTimeout(redeemPhoneCheckRef.current);
    const cleaned = val.replace(/\s+/g, '');
    if (cleaned.length >= 10) {
      setCheckingBal(true);
      redeemPhoneCheckRef.current = setTimeout(async () => {
        try {
          const r = await fetch(`${CB_API}?action=cashback-balance&phone=${encodeURIComponent(val.trim())}&restaurantId=${rid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const d = await r.json();
          setRedeemBalance(d);
        } catch { setRedeemBalance(null); }
        finally { setCheckingBal(false); }
      }, 600);
    }
  }

  async function handleRedeem(e) {
    e.preventDefault();
    if (!redeemPhone.trim() || !redeemAmount) return;
    setRedeeming(true); setRedeemError(''); setRedeemResult(null);
    try {
      const res = await fetch(`${CB_API}?action=cashback-redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId: rid, phone: redeemPhone.trim(), amountToRedeem: Number(redeemAmount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRedeemResult(data);
      setRedeemBalance(b => b ? { ...b, balance: data.newBalance } : null);
    } catch (err) {
      setRedeemError(err.message);
    } finally {
      setRedeeming(false);
    }
  }

  function resetRedeem() {
    setRedeemPhone(''); setRedeemAmount(''); setRedeemBalance(null);
    setRedeemResult(null); setRedeemError('');
  }

  if (progLoading) return <div className="db-content"><div className="db-loading"><div className="db-spinner" /></div></div>;

  // ── Sub-nav ──
  const subViews = [
    { id: 'earn',      label: '+ Earn' },
    { id: 'redeem',    label: '− Redeem' },
    { id: 'customers', label: 'Customers' },
    { id: 'setup',     label: 'Setup' },
  ];

  return (
    <div className="db-content">
      <div className="db-header">
        <h1 className="db-title">Cashback Card</h1>
        <p className="db-subtitle">
          {program
            ? `${program.cashbackRate}% cashback on every visit · Rs. balance per customer`
            : 'Set up your cashback program below.'}
        </p>
      </div>

      {/* Sub-nav */}
      <div className="cb-subnav">
        {subViews.map(v => (
          <button key={v.id} className={`cb-subnav-btn${view === v.id ? ' active' : ''}`} onClick={() => setView(v.id)}>
            {v.label}
          </button>
        ))}
      </div>

      {/* ── Earn view ── */}
      {view === 'earn' && (
        !program ? (
          <div className="db-card cb-empty-card">
            <p className="db-empty-icon">💳</p>
            <p>No cashback program yet.</p>
            <button className="db-btn-primary" style={{ marginTop: '1rem' }} onClick={() => setView('setup')}>
              Set up cashback →
            </button>
          </div>
        ) : earnResult ? (
          <div className="db-card cb-result-card">
            <div className="cb-result-icon">✓</div>
            <h2 className="cb-result-title">Rs. {earnResult.cashbackEarned} earned!</h2>
            <p className="cb-result-sub">
              {earnResult.customer.name ? `${earnResult.customer.name} · ` : ''}
              {earnResult.customer.phone}
            </p>
            <div className="cb-balance-display">
              <span className="cb-balance-label">Total balance</span>
              <span className="cb-balance-value">Rs. {earnResult.balance}</span>
            </div>
            <button className="db-btn-outline" style={{ marginTop: '1.25rem' }} onClick={resetEarn}>
              Next Customer →
            </button>
          </div>
        ) : (
          <div className="db-card" style={{ maxWidth: 480 }}>
            <h2 className="db-card-title">Add Cashback</h2>
            <p className="db-card-sub" style={{ marginBottom: '1rem' }}>
              Enter the customer's phone and bill amount. They earn {program.cashbackRate}% back.
            </p>
            <form onSubmit={handleEarn}>
              <div className="db-field">
                <label className="db-label">Phone number</label>
                <input className="db-input" type="tel" inputMode="numeric" placeholder="03XX XXXXXXX"
                  value={earnPhone} onChange={e => setEarnPhone(e.target.value)} autoComplete="off" />
              </div>
              <div className="db-field">
                <label className="db-label">Customer name <span className="db-optional">(optional)</span></label>
                <input className="db-input" type="text" placeholder="e.g. Sara"
                  value={earnName} onChange={e => setEarnName(e.target.value)} />
              </div>
              <div className="db-field">
                <label className="db-label">Bill amount (Rs.)</label>
                <input className="db-input cb-amount-input" type="number" min="1" placeholder="e.g. 2500"
                  value={earnAmount} onChange={e => setEarnAmount(e.target.value)} />
                {earnAmount && Number(earnAmount) > 0 && (
                  <span className="db-hint cb-preview-hint">
                    Cashback: <strong>Rs. {Math.round((Number(earnAmount) * program.cashbackRate) / 100)}</strong>
                  </span>
                )}
              </div>
              {earnError && <p className="db-scan-error">{earnError}</p>}
              <button className="db-btn-primary db-btn-lg" type="submit"
                disabled={earning || !earnPhone.trim() || !earnAmount}
                style={{ width: '100%', marginTop: '0.5rem' }}>
                {earning ? 'Adding…' : '+ Add Cashback'}
              </button>
            </form>
          </div>
        )
      )}

      {/* ── Redeem view ── */}
      {view === 'redeem' && (
        !program ? (
          <div className="db-card cb-empty-card">
            <p className="db-empty-icon">💳</p>
            <p>No cashback program yet.</p>
            <button className="db-btn-primary" style={{ marginTop: '1rem' }} onClick={() => setView('setup')}>
              Set up cashback →
            </button>
          </div>
        ) : redeemResult ? (
          <div className="db-card cb-result-card">
            <div className="cb-result-icon cb-result-icon--redeem">−</div>
            <h2 className="cb-result-title">Rs. {redeemResult.amountRedeemed} redeemed</h2>
            <p className="cb-result-sub">
              {redeemResult.customer.name ? `${redeemResult.customer.name} · ` : ''}
              {redeemResult.customer.phone}
            </p>
            <div className="cb-balance-display">
              <span className="cb-balance-label">Remaining balance</span>
              <span className="cb-balance-value">Rs. {redeemResult.newBalance}</span>
            </div>
            <button className="db-btn-outline" style={{ marginTop: '1.25rem' }} onClick={resetRedeem}>
              Next Customer →
            </button>
          </div>
        ) : (
          <div className="db-card" style={{ maxWidth: 480 }}>
            <h2 className="db-card-title">Redeem Cashback</h2>
            <p className="db-card-sub" style={{ marginBottom: '1rem' }}>
              Enter the customer's phone to check their balance, then apply a redemption.
            </p>
            <form onSubmit={handleRedeem}>
              <div className="db-field">
                <label className="db-label">Phone number</label>
                <input className="db-input" type="tel" inputMode="numeric" placeholder="03XX XXXXXXX"
                  ref={redeemPhoneRef}
                  value={redeemPhone} onChange={e => handleRedeemPhoneChange(e.target.value)} autoComplete="off" />
                {checkingBal && <span className="db-hint">Checking balance…</span>}
              </div>

              {redeemBalance && (
                <div className="cb-balance-chip">
                  <span>{redeemBalance.customer?.name || redeemPhone}</span>
                  <span className="cb-balance-chip-val">
                    {redeemBalance.balance > 0
                      ? `Rs. ${redeemBalance.balance} available`
                      : 'No balance'}
                  </span>
                </div>
              )}

              <div className="db-field">
                <label className="db-label">Amount to redeem (Rs.)</label>
                <input className="db-input cb-amount-input" type="number" min="1"
                  max={redeemBalance?.balance || undefined}
                  placeholder={redeemBalance?.balance ? `Max Rs. ${redeemBalance.balance}` : 'e.g. 500'}
                  value={redeemAmount} onChange={e => setRedeemAmount(e.target.value)} />
              </div>

              {redeemError && <p className="db-scan-error">{redeemError}</p>}
              <button className="db-btn-primary db-btn-lg" type="submit"
                disabled={redeeming || !redeemPhone.trim() || !redeemAmount || !redeemBalance?.balance}
                style={{ width: '100%', marginTop: '0.5rem', background: '#10b981' }}>
                {redeeming ? 'Processing…' : '− Redeem Cashback'}
              </button>
            </form>
          </div>
        )
      )}

      {/* ── Customers view ── */}
      {view === 'customers' && (
        <div className="db-card">
          <div className="db-table-toolbar">
            <span className="db-card-title" style={{ marginBottom: 0 }}>
              {cbStats?.totalCustomers ?? 0} customer{cbStats?.totalCustomers !== 1 ? 's' : ''}
            </span>
            <button className="db-btn-outline" onClick={loadCbCustomers}>↻ Refresh</button>
          </div>

          {cbStats && (
            <div className="cb-mini-stats">
              {[
                { label: 'Outstanding balance', value: `Rs. ${cbStats.totalBalance}` },
                { label: 'Total earned',         value: `Rs. ${cbStats.totalEarned}` },
                { label: 'Total redeemed',        value: `Rs. ${cbStats.totalRedeemed}` },
              ].map(s => (
                <div key={s.label} className="cb-mini-stat">
                  <span className="cb-mini-stat-val">{s.value}</span>
                  <span className="cb-mini-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {cbCustLoading ? (
            <div className="db-loading"><div className="db-spinner" /></div>
          ) : cbCustomers.length === 0 ? (
            <div className="db-empty">
              <p className="db-empty-icon">💳</p>
              <p>No customers yet.</p>
            </div>
          ) : (
            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr><th></th><th>Name</th><th>Phone</th><th>Balance</th><th>Total Earned</th><th>Redeemed</th></tr>
                </thead>
                <tbody>
                  {cbCustomers.map((c, i) => (
                    <tr key={i}>
                      <td style={{ width: 40 }}>
                        <div className="db-cust-avatar" style={{ background: '#10b981' }}>
                          {(c.name?.[0] || c.phone?.[0] || '?').toUpperCase()}
                        </div>
                      </td>
                      <td className="db-td-name">{c.name || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                      <td className="db-td-phone">{c.phone}</td>
                      <td><strong style={{ color: '#10b981' }}>Rs. {c.balance}</strong></td>
                      <td className="db-td-date">Rs. {c.totalEarned}</td>
                      <td className="db-td-date">Rs. {c.totalRedeemed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Setup view ── */}
      {view === 'setup' && (
        <div className="db-card" style={{ maxWidth: 480 }}>
          <h2 className="db-card-title">{program ? 'Cashback Settings' : 'Set Up Cashback'}</h2>

          <div className="db-field">
            <label className="db-label">Cashback Rate (%)</label>
            <input className="db-input" type="number" min="1" max="50" step="0.5"
              value={cbForm.cashbackRate}
              onChange={e => setCbForm(f => ({ ...f, cashbackRate: Number(e.target.value) }))} />
            <span className="db-hint">
              Customer spends Rs. 1,000 → earns Rs. {Math.round((1000 * cbForm.cashbackRate) / 100)} cashback
            </span>
          </div>

          <div className="db-field">
            <label className="db-label">Minimum spend to earn <span className="db-optional">(optional)</span></label>
            <input className="db-input" type="number" min="0" placeholder="0 = no minimum"
              value={cbForm.minSpendToEarn}
              onChange={e => setCbForm(f => ({ ...f, minSpendToEarn: Number(e.target.value) }))} />
            <span className="db-hint">Leave 0 to earn cashback on any purchase amount</span>
          </div>

          <div className="db-field">
            <label className="db-label">Minimum balance to redeem <span className="db-optional">(optional)</span></label>
            <input className="db-input" type="number" min="0" placeholder="0 = no minimum"
              value={cbForm.minBalanceToRedeem}
              onChange={e => setCbForm(f => ({ ...f, minBalanceToRedeem: Number(e.target.value) }))} />
            <span className="db-hint">Leave 0 to allow redemption of any balance amount</span>
          </div>

          <div className="db-field db-field-row">
            <label className="db-label" style={{ marginBottom: 0 }}>Program Active</label>
            <label className="db-toggle">
              <input type="checkbox" checked={cbForm.active}
                onChange={e => setCbForm(f => ({ ...f, active: e.target.checked }))} />
              <span className="db-toggle-slider" />
            </label>
          </div>

          <div className="db-save-row">
            <button className="db-btn-primary" onClick={saveCbProgram} disabled={cbSaving}>
              {cbSaving ? 'Saving…' : program ? 'Save Changes' : 'Activate Cashback'}
            </button>
            {cbSaveMsg && (
              <span className={`db-save-msg${cbSaveMsg === 'Saved!' ? ' ok' : ' err'}`}>{cbSaveMsg}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── POS Integration Tab ───────────────────────────────────── */
function PosTab({ rid, token }) {
  const [apiKey, setApiKey]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revoking, setRevoking]   = useState(false);
  const [copied, setCopied]       = useState(false);
  const [showKey, setShowKey]     = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (!rid) return;
    fetch(`${API}?action=get-key&restaurantId=${rid}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : { apiKey: null })
      .then(d => setApiKey(d.apiKey || null))
      .finally(() => setLoading(false));
  }, [rid, token]);

  async function handleGenerate() {
    setGenerating(true); setError('');
    try {
      const res = await fetch(`${API}?action=generate-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId: rid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApiKey(data.apiKey);
      setShowKey(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleRevoke() {
    if (!window.confirm('Revoke this API key? The POS will stop working immediately until you generate a new one.')) return;
    setRevoking(true); setError('');
    try {
      const res = await fetch(`${API}?action=revoke-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ restaurantId: rid }),
      });
      if (!res.ok) throw new Error('Failed to revoke');
      setApiKey(null);
      setShowKey(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setRevoking(false);
    }
  }

  function handleCopy() {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const maskedKey = apiKey
    ? 'dlk_' + '•'.repeat(32) + apiKey.slice(-8)
    : null;

  const stampEndpoint  = `https://www.trydecidr.xyz/api/loyalty?action=stamp`;
  const cbEndpoint     = `https://www.trydecidr.xyz/api/loyalty?action=cashback-earn`;

  const codeSnippet = `POST ${stampEndpoint}
X-API-Key: ${apiKey || 'YOUR_API_KEY'}
Content-Type: application/json

{
  "restaurantId": "${rid}",
  "phone": "03001234567",
  "name": "Customer Name"
}`;

  const responseSnippet = `{
  "success": true,
  "rewarded": false,
  "stampCount": 3,
  "stampsRequired": 9,
  "rewardName": "Free Haircut",
  "customer": {
    "name": "Sara",
    "phone": "+923001234567"
  }
}`;

  return (
    <div className="db-content">
      <div className="db-header">
        <h1 className="db-title">POS Integration</h1>
        <p className="db-subtitle">Connect your salon POS to stamp customers automatically on checkout.</p>
      </div>

      <div className="db-grid-2">
        {/* API Key card */}
        <div className="db-card">
          <h2 className="db-card-title">Your API Key</h2>
          <p className="db-card-sub" style={{ marginBottom: '1rem' }}>
            Give this key to your POS provider. It lets them add stamps on your behalf — keep it secret.
          </p>

          {loading ? (
            <div className="db-loading"><div className="db-spinner" /></div>
          ) : apiKey ? (
            <>
              <div className="pos-key-row">
                <code className="pos-key-code">
                  {showKey ? apiKey : maskedKey}
                </code>
                <button className="db-btn-outline pos-key-btn" onClick={() => setShowKey(v => !v)}>
                  {showKey ? 'Hide' : 'Show'}
                </button>
                <button className="db-btn-outline pos-key-btn" onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="pos-key-actions">
                <button className="db-btn-primary" onClick={handleGenerate} disabled={generating}>
                  {generating ? 'Generating…' : '↻ Regenerate Key'}
                </button>
                <button className="db-btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}
                  onClick={handleRevoke} disabled={revoking}>
                  {revoking ? 'Revoking…' : 'Revoke'}
                </button>
              </div>
              <p className="db-hint" style={{ marginTop: '0.5rem' }}>
                Regenerating creates a new key and immediately invalidates the old one.
              </p>
            </>
          ) : (
            <>
              <p className="db-hint" style={{ marginBottom: '1rem' }}>No API key yet. Generate one to get started.</p>
              <button className="db-btn-primary" onClick={handleGenerate} disabled={generating}>
                {generating ? 'Generating…' : '+ Generate API Key'}
              </button>
            </>
          )}

          {error && <p className="db-scan-error" style={{ marginTop: '0.75rem' }}>{error}</p>}
        </div>

        {/* How it works */}
        <div className="db-card">
          <h2 className="db-card-title">How it works</h2>
          <div className="pos-steps">
            <div className="pos-step">
              <span className="pos-step-num">1</span>
              <div>
                <strong>Customer visits salon</strong>
                <p>Staff enters the customer's phone number at checkout in the POS.</p>
              </div>
            </div>
            <div className="pos-step">
              <span className="pos-step-num">2</span>
              <div>
                <strong>POS calls our API</strong>
                <p>On payment, the POS sends one HTTP request with the phone number and your API key.</p>
              </div>
            </div>
            <div className="pos-step">
              <span className="pos-step-num">3</span>
              <div>
                <strong>Stamp added automatically</strong>
                <p>We stamp the card. If the customer hits the target, we return <code>rewarded: true</code> so the POS can show a reward alert.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code snippets */}
      <div className="db-card" style={{ marginTop: '1.5rem' }}>
        <h2 className="db-card-title">Integration Code</h2>
        <p className="db-card-sub" style={{ marginBottom: '1rem' }}>
          Share this with the POS developer. One API call per checkout is all it takes.
        </p>

        <div className="db-grid-2">
          <div>
            <p className="db-label" style={{ marginBottom: '0.4rem' }}>Request</p>
            <pre className="pos-code-block">{codeSnippet}</pre>
          </div>
          <div>
            <p className="db-label" style={{ marginBottom: '0.4rem' }}>Response</p>
            <pre className="pos-code-block">{responseSnippet}</pre>
          </div>
        </div>

        <div className="pos-note">
          <strong>Reward alert:</strong> When <code>rewarded: true</code> is returned, the customer has just earned their free reward.
          Show a popup in the POS so staff can apply the discount.
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
const TABS = [
  { id: 'scan',      Icon: Camera,    label: 'Scan'      },
  { id: 'cashback',  Icon: Banknote,  label: 'Cashback'  },
  { id: 'setup',     Icon: Settings2, label: 'Setup'     },
  { id: 'customers', Icon: Users,     label: 'Customers' },
  { id: 'stats',     Icon: BarChart3, label: 'Analytics' },
  { id: 'pos',       Icon: Zap,       label: 'POS'       },
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
    staffPin: '',
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
            staffPin:       '',
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
        {tab === 'cashback' && (
          <CashbackTab rid={rid} token={token} />
        )}
        {tab === 'stats' && (
          <StatsTab stats={stats} customers={customers} />
        )}
        {tab === 'pos' && (
          <PosTab rid={rid} token={token} />
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
