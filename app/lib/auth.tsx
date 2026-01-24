import React from 'react';
import { Navigate, useLocation } from 'react-router';
import {
  useGetCurrentUserQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useRefreshMutation,
} from '../store/api';

interface User {
  id?: number;
  name?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
  username?: string;
}

// Hook-based auth (no context)
export function useAuth() {
  const { data: user, refetch } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [loginTrigger] = useLoginMutation();
  const [signupTrigger] = useSignupMutation();
  const [logoutTrigger] = useLogoutMutation();
  const [refreshTrigger] = useRefreshMutation();

  const login = React.useCallback(
    async (email: string, password: string) => {
      try {
        await loginTrigger({ email, password }).unwrap();
        await refetch();
        return true;
      } catch (e) {
        console.error('Login error:', e);
        return false;
      }
    },
    [loginTrigger, refetch],
  );

  const signup = React.useCallback(
    async (name: string, email: string, password: string) => {
      try {
        await signupTrigger({ name, email, password }).unwrap();
        await refetch();
        return true;
      } catch (e) {
        const err = (e as any)?.data || (e as Error).message;
        throw new Error(String(err));
      }
    },
    [signupTrigger, refetch],
  );

  const logout = React.useCallback(async () => {
    try {
      await logoutTrigger().unwrap();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      try {
        await refetch();
      } catch {}
    }
  }, [logoutTrigger, refetch]);

  const checkAuth = React.useCallback(async () => {
    try {
      await refetch();
    } catch (e) {
      console.error('checkAuth error', e);
    }
  }, [refetch]);

  return {
    user: (user ?? null) as User | null,
    login,
    signup,
    logout,
    checkAuth,
  };
}

// Small component to keep localStorage in sync and run refresh interval
export function AuthListener() {
  const { data: user } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [refreshTrigger] = useRefreshMutation();

  // no localStorage writes anymore; RTK Query cache is the source of truth

  React.useEffect(() => {
    const interval = setInterval(
      () => {
        refreshTrigger().catch(() => {});
      },
      14 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [refreshTrigger]);

  return null;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

export default useAuth;
