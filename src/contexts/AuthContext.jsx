import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(() => localStorage.getItem('loyalty_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch('/api/auth', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setUser(data.user); else { setToken(null); localStorage.removeItem('loyalty_token'); } })
      .finally(() => setLoading(false));
  }, [token]);

  function login(tok, userData) {
    localStorage.setItem('loyalty_token', tok);
    setToken(tok);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('loyalty_token');
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
