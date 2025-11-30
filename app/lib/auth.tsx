import React from 'react';
import { Navigate, useLocation } from 'react-router';

// Tambahkan interface untuk response API
interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
}

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const STORAGE_KEY = 'app_auth';
const API_BASE_URL = 'http://localhost:8080/api/v1/auth';

// Auth service untuk API calls
const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    return response.json();
  },

  async register(userData: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Registration failed');
    }

    return response.json();
  },
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

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
  const [user, setUser] = React.useState<User | null>(() => readFromStorage().user);
  const [token, setToken] = React.useState<string | null>(() => readFromStorage().token);

  React.useEffect(() => {
    writeToStorage({ user, token });
  }, [user, token]);

  const login = React.useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      setUser({
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role
      });
      setToken(response.token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

 const signup = React.useCallback(async (name: string, email: string, password: string) => {
  try {
    const response = await authService.register({ name, email, password });
    
    setUser({
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role
    });
    setToken(response.token);
    return; // tidak perlu return apa-apa, karena sukses
  } catch (error) {
    console.error('Signup error:', error.message);
    // Lempar ulang error agar bisa ditangani di form
    throw error;
  }
}, []);

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