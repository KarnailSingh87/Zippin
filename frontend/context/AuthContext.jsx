import React, { createContext, useContext, useState, useEffect } from "react";

const API = "";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("blinkit_token");
    if (saved) {
      setToken(saved);
      fetchUserWithToken(saved);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchUserWithToken(t) {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const u = await res.json();
        setUser({
          id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          roles: u.roles,
          addresses: u.addresses,
        });
      } else {
        localStorage.removeItem("blinkit_token");
        setToken(null);
      }
    } catch {}
    setLoading(false);
  }

  async function fetchUser() {
    if (token) await fetchUserWithToken(token);
  }

  async function login(email, password) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("blinkit_token", data.token);
  }

  async function register(name, email, phone, password) {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("blinkit_token", data.token);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("blinkit_token");
  }

  async function updateUser(updates) {
    if (!token) return;
    const res = await fetch(`${API}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const u = await res.json();
      setUser({
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        roles: u.roles,
        addresses: u.addresses,
      });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
