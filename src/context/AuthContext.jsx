import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('techsphere_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('techsphere_token') || null);

  // login → POST /auth/login
  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { token: jwt, user: userData } = data;

    localStorage.setItem('techsphere_token', jwt);
    localStorage.setItem('techsphere_user', JSON.stringify(userData));

    setToken(jwt);
    setUser(userData);
    navigate('/dashboard');
  }, [navigate]);

  // Google OAuth callback handler
  const handleGoogleLogin = useCallback((token, userData) => {
    localStorage.setItem('techsphere_token', token);
    localStorage.setItem('techsphere_user', JSON.stringify(userData));

    setToken(token);
    setUser(userData);
    navigate('/dashboard');
  }, [navigate]);

  // logout → clear everything, go to login
  const logout = useCallback(() => {
    localStorage.removeItem('techsphere_token');
    localStorage.removeItem('techsphere_user');
    setToken(null);
    setUser(null);
    navigate('/');
  }, [navigate]);

  const isAdmin = useCallback(() => user?.role === 'admin', [user]);
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, login, logout, handleGoogleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
