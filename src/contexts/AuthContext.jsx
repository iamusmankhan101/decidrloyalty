import React, { createContext, useContext, useState, useEffect } from 'react';

import { clearNiche, saveNiche } from '../components/niches';

const AuthContext = createContext(null);
// The session itself lives in an HttpOnly cookie the browser attaches on its own,
// so nothing here is a credential — this is only the cached profile we render
// before the server confirms who's signed in.
const USER_KEY = 'loyalty_user';

function clearStoredAuth() {
  // The niche seeds new-program defaults, so it must not outlive the account.
  clearNiche();
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_KEY);
  // Tokens used to be kept here. Clear any left over from before the move.
  localStorage.removeItem('loyalty_token');
  sessionStorage.removeItem('loyalty_token');
}

function readUser() {
  try {
    const stored = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function storeUser(user) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(readUser);
  const [loading, setLoading] = useState(true);

  // Runs once on mount — asks the server who the cookie belongs to. A cached user
  // renders immediately; this either confirms it or clears it.
  useEffect(() => {
    let cancelled = false;

    fetch('/api/auth', { credentials: 'same-origin' })
      .then(async res => {
        if (cancelled) return;
        if (res.status === 401) {
          setUser(null);
          clearStoredAuth();
          return;
        }
        if (!res.ok) return; // Server trouble — keep the cached session as-is.
        const data = await res.json().catch(() => null);
        if (cancelled || !data?.user) return;
        setUser(data.user);
        storeUser(data.user);
        if (data.user.niche) saveNiche(data.user.niche);
      })
      .catch(() => {}) // Offline: the cached user stands until the server says otherwise.
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // The cookie is already set by the login response; we only record who it is.
  function login(userData) {
    storeUser(userData);
    setUser(userData);
  }

  async function logout() {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {} // Even if the call fails, drop the local session.
    clearStoredAuth();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
