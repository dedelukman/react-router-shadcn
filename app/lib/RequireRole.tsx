import { Navigate } from 'react-router';
import { useAuth } from './auth';

export function RequireRole({
  allow,
  children,
}: {
  allow: string[];
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return null;

  const roles = user.roles ?? [];
  const allowed = allow.some(r => roles.includes(r));

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
