import React, { createContext, useContext, useState, useEffect } from 'react';

import { clearNiche } from '../components/niches';

const AuthContext = createContext(null);
const TOKEN_KEY = 'loyalty_token';
const USER_KEY = 'loyalty_user';

function readStoredItem(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

function clearStoredAuth() {
  // The niche seeds new-program defaults, so it must not outlive the account.
  clearNiche();
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function readUser() {
  try { const s = readStoredItem(USER_KEY); return s ? JSON.parse(s) : null; }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(readUser);
  const [token, setToken]     = useState(() => readStoredItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  // Runs once on mount only — verifies a stored token after a page refresh.
  // Not re-triggered by login() changing token state.
  useEffect(() => {
    const storedToken = readStoredItem(TOKEN_KEY);
    if (!storedToken) { setLoading(false); return; }

    fetch('/api/auth', { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(r => {
        if (r.status === 401) {
          setToken(null); setUser(null);
          clearStoredAuth();
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem(TOKEN_KEY, storedToken);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          sessionStorage.removeItem(TOKEN_KEY);
          sessionStorage.removeItem(USER_KEY);
        }
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function login(tok, userData) {
    localStorage.setItem(TOKEN_KEY, tok);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setToken(tok);
    setUser(userData);
  }

  function logout() {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
