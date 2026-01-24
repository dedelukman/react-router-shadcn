import { Navigate } from 'react-router';
import { useAuth } from './auth';

export function RequirePermission({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return null;

  const permissions = user.permissions ?? [];

  if (!permissions.includes(permission)) {
     return <Navigate to="/app/error/403" replace />;
  }

  return <>{children}</>;
}
