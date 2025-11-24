import * as React from 'react';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Link } from 'react-router';

const dashboardRoutes = [
  { label: 'Account', href: '/dashboard/account' },
  { label: 'Billing', href: '/dashboard/billing' },
  { label: 'Notifications', href: '/dashboard/notifications' },
  { label: 'Settings', href: '/dashboard/settings' },
  { label: 'Help / Get Help', href: '/dashboard/gethelp' },
  { label: 'Search', href: '/dashboard/search' },
];

export default function Search() {
  const [q, setQ] = React.useState('');

  const results = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return dashboardRoutes.filter((r) => {
      return (
        r.label.toLowerCase().includes(term) ||
        r.href.toLowerCase().includes(term)
      );
    });
  }, [q]);

  return (
    <div className='m-2 md:m-15 space-y-6'>

      <div className='rounded-md border p-4'>
        <div className='flex gap-2'>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Search dashboard menu (label or path)...'
          />
          <Button variant='outline' onClick={() => setQ('')}>
            Clear
          </Button>
        </div>

        <div className='mt-4'>
          {!q ? (
            <div className='text-sm text-muted-foreground'>
              Type to search dashboard pages (e.g., Account, Billing).
            </div>
          ) : results.length === 0 ? (
            <div className='text-sm text-muted-foreground'>
              No pages match "{q}".
            </div>
          ) : (
            <ul className='space-y-2'>
              {results.map((r) => (
                <li
                  key={r.href}
                  className='flex items-center justify-between rounded-md border px-3 py-2'
                >
                  <div>
                    <div className='font-medium'>{r.label}</div>
                    <div className='text-xs text-muted-foreground'>
                      {r.href}
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Link to={r.href} className='text-sm'>
                      Open
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
