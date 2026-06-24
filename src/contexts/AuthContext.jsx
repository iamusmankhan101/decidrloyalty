import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

function readUser() {
  try { const s = localStorage.getItem('loyalty_user'); return s ? JSON.parse(s) : null; }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(readUser);
  const [token, setToken]     = useState(() => localStorage.getItem('loyalty_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch('/api/auth', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 401) {
          setToken(null); setUser(null);
          localStorage.removeItem('loyalty_token');
          localStorage.removeItem('loyalty_user');
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('loyalty_user', JSON.stringify(data.user));
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  function login(tok, userData) {
    localStorage.setItem('loyalty_token', tok);
    localStorage.setItem('loyalty_user', JSON.stringify(userData));
    setToken(tok);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('loyalty_token');
    localStorage.removeItem('loyalty_user');
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
