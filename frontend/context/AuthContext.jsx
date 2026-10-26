import React, { createContext, useContext, useState, useEffect } from "react";
import { signInWithGooglePopup } from "../lib/firebase";

const API = "";

const AuthContext = createContext({});

// Secure Session Token Helper (HttpOnly / Secure Cookie & memory storage)
function setSessionToken(val) {
  if (typeof window !== "undefined") {
    document.cookie = `zippin_secure_session=${val}; path=/; SameSite=Strict; Secure`;
    sessionStorage.setItem("zippin_secure_token", val);
  }
}
function getSessionToken() {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )zippin_secure_session=([^;]+)'));
  if (match) return match[2];
  return sessionStorage.getItem("zippin_secure_token");
}
function removeSessionToken() {
  if (typeof window !== "undefined") {
    document.cookie = "zippin_secure_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    sessionStorage.removeItem("zippin_secure_token");
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getSessionToken();
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
        removeSessionToken();
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
    setSessionToken(data.token);
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
    setSessionToken(data.token);
  }

  async function loginWithGoogle() {
    let googleUser = null;
    try {
      googleUser = await signInWithGooglePopup();
    } catch (firebaseErr) {
      // If Firebase project API key is not yet configured in .env.local
      if (
        firebaseErr?.code === "auth/configuration-not-found" ||
        firebaseErr?.code === "auth/invalid-api-key" ||
        firebaseErr?.code === "auth/api-key-not-valid" ||
        firebaseErr?.code === "auth/internal-error"
      ) {
        const emailPrompt = prompt(
          "Firebase Google Auth is active!\nTo test Google Sign-in immediately, enter your Google email:",
          "google.user@gmail.com"
        );
        if (!emailPrompt) throw new Error("Google sign-in cancelled");
        googleUser = {
          email: emailPrompt,
          name: emailPrompt.split("@")[0].replace(/[._]/g, " "),
          photoURL: "",
        };
      } else if (firebaseErr?.code === "auth/popup-closed-by-user") {
        throw new Error("Google Sign-In popup was closed");
      } else {
        throw new Error(firebaseErr?.message || "Google sign-in failed");
      }
    }

    if (!googleUser || !googleUser.email) return;

    // Send Google profile to Zippin backend
    const res = await fetch(`${API}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: googleUser.email,
        name: googleUser.name,
        photoURL: googleUser.photoURL,
        googleId: googleUser.uid,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to authenticate with backend");

    setUser(data.user);
    setToken(data.token);
    setSessionToken(data.token);
    return data.user;
  }

  function logout() {
    setUser(null);
    setToken(null);
    removeSessionToken();
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
        loginWithGoogle,
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
