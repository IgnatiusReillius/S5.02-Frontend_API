import { useState, useEffect, createContext, useCallback } from "react";
import { API_BASE } from "../config";

// ─────────────────────────────────────────────────────────────────────────────
// AUTH CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      } else {
        setToken(null);
        localStorage.removeItem("token");
      }
    } catch {
      setToken(null);
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid credentials");
    const newToken = data.access_token;
    setToken(newToken);
    localStorage.setItem("token", newToken);
    // fetch user
    const me = await (await fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${newToken}` } })).json();
    setUser(me.data);
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, password_confirmation: password }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.errors ? Object.values(data.errors).flat().join(" ") : (data.message || "Error");
      throw new Error(msg);
    }
    setToken(data.access_token);
    localStorage.setItem("token", data.access_token);
    setUser(data.data);
  };

  const logout = async () => {
    if (token) {
      try { await fetch(`${API_BASE}/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }); } catch {}
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
