import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API = '';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  addresses?: any[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: any) => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('blinkit_token');
    if (saved) {
      setToken(saved);
      fetchUserWithToken(saved);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchUserWithToken(t: string) {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      if (res.ok) {
        const u = await res.json();
        setUser({ id: u._id, name: u.name, email: u.email, phone: u.phone, roles: u.roles, addresses: u.addresses });
      } else {
        localStorage.removeItem('blinkit_token');
        setToken(null);
      }
    } catch {}
    setLoading(false);
  }

  async function fetchUser() {
    if (token) await fetchUserWithToken(token);
  }

  async function login(email: string, password: string) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('blinkit_token', data.token);
  }

  async function register(name: string, email: string, phone: string, password: string) {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('blinkit_token', data.token);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('blinkit_token');
  }

  async function updateUser(updates: any) {
    if (!token) return;
    const res = await fetch(`${API}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const u = await res.json();
      setUser({ id: u._id, name: u.name, email: u.email, phone: u.phone, roles: u.roles, addresses: u.addresses });
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
