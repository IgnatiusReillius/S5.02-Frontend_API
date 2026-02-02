import { useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_BASE } from "../config";

// ─────────────────────────────────────────────────────────────────────────────
// API HELPER
// ─────────────────────────────────────────────────────────────────────────────
export function useApi() {
  const { token } = useContext(AuthContext);

  const req = useCallback(async (method, path, body = null) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    if (res.status === 204) return null;
    const data = await res.json();
    if (!res.ok) {
      const msg = data.errors ? Object.values(data.errors).flat().join(" ") : (data.message || `Error ${res.status}`);
      throw new Error(msg);
    }
    return data;
  }, [token]);

  return { get: (p) => req("GET", p), post: (p, b) => req("POST", p, b), put: (p, b) => req("PUT", p, b), del: (p) => req("DELETE", p) };
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST HOOK
// ─────────────────────────────────────────────────────────────────────────────
export function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);
  return { toast, showToast: show };
}
