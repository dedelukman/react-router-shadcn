import React from 'react';
import { Navigate, useLocation } from 'react-router';

type User = {
  name?: string;
  email?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const STORAGE_KEY = 'app_auth';

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

function readFromStorage(): { user: User | null; token: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    return JSON.parse(raw);
  } catch {
    return { user: null, token: null };
  }
}

function writeToStorage(payload: { user: User | null; token: string | null }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(
    () => readFromStorage().user
  );
  const [token, setToken] = React.useState<string | null>(
    () => readFromStorage().token
  );

  React.useEffect(() => {
    writeToStorage({ user, token });
  }, [user, token]);

  const login = React.useCallback(async (email: string, password: string) => {
    // Mock login: accept any non-empty email/password. Replace with real API call.
    if (!email || !password) return false;
    const fakeToken = `token-${Date.now()}`;
    setUser({ email });
    setToken(fakeToken);
    return true;
  }, []);

  const signup = React.useCallback(
    async (name: string, email: string, password: string) => {
      // Mock signup: accept inputs and auto-login. Replace with real API call.
      if (!email || !password) return false;
      const fakeToken = `token-${Date.now()}`;
      setUser({ name, email });
      setToken(fakeToken);
      return true;
    },
    []
  );

  const logout = React.useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const value = React.useMemo(
    () => ({ user, token, login, signup, logout }),
    [user, token, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = React.useContext(AuthContext);
  const location = useLocation();

  if (!auth || !auth.user) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

export default AuthContext;
