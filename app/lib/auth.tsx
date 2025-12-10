import React from "react";
import { Navigate, useLocation } from "react-router";

interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
}

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "auth";
const STORAGE_KEY = "app_user"; // hanya simpan user, bukan token

// ===============================
// STORAGE HELPERS
// ===============================
function readUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
}

// ===============================
// CONTEXT
// ===============================
const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => readUser());

  const login = React.useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        credentials: "include", // ✔ penting
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json(); // hanya info user, bukan token
      setUser(data);
      saveUser(data);

      return true;
    } catch (e) {
      console.error("Login error:", e);
      return false;
    }
  }, []);

  const signup = React.useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      setUser(data);
      saveUser(data);
      return true;
    },
    []
  );

  const logout = React.useCallback(async () => {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    saveUser(null);
  }, []);

  const checkAuth = React.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        saveUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
      saveUser(data);
    } catch {
      setUser(null);
      saveUser(null);
    }
  }, []);

  const value = { user, login, signup, logout, checkAuth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

export default AuthContext;
