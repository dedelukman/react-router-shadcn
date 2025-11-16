export function routeToKey(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return 'home';

  // convert route into key format, example:
  // /dashboard/users -> dashboard.users
  return segments.join('.').toLowerCase();
}
