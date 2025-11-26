'use client';

import * as React from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { IconBell, IconMail } from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { useTranslation } from 'react-i18next';

type Notification = {
  id: string;
  title: string;
  body?: string;
  date: string;
  read?: boolean;
  archived?: boolean;
};

const STORAGE_KEY = 'app_notifications';

function readNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Notification[]) : [];
  } catch {
    return [];
  }
}

export function NotificationsPopover() {
  const {t} = useTranslation ();
  const [items, setItems] = React.useState<Notification[]>(() =>
    readNotifications()
  );
  // only count unread non-archived notifications
  const unreadCount = React.useMemo(
    () => items.filter((i) => !i.read && !i.archived).length,
    [items]
  );

  // Keep localStorage in sync and notify other listeners (same-window and cross-window)
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      // dispatch a custom event so same-window listeners can react
      window.dispatchEvent(new Event('app_notifications_changed'));
    } catch {}
  }, [items]);

  // Listen for storage changes (other tabs) and our custom event (same tab)
  React.useEffect(() => {
    function handleUpdate() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as Notification[]) : [];
        // update only when different to avoid loops
        const a = JSON.stringify(parsed || []);
        const b = JSON.stringify(items || []);
        if (a !== b) setItems(parsed);
      } catch {
        // ignore
      }
    }

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) handleUpdate();
    }

    window.addEventListener('app_notifications_changed', handleUpdate);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('app_notifications_changed', handleUpdate);
      window.removeEventListener('storage', onStorage);
    };
  }, [items]);

  function markRead(id: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, read: true } : it))
    );
    toast.success('Marked read');
  }

  function markAllRead() {
    // only mark non-archived notifications as read
    setItems((prev) =>
      prev.map((it) => (it.archived ? it : { ...it, read: true }))
    );
    toast.success('All notifications marked read');
  }

  // show non-archived notifications only in the popover
  const list = items.filter((i) => !i.archived).slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' aria-label='Notifications' className='relative'>
          <IconBell />
          {unreadCount > 0 && (
            <Badge className='absolute -right-1 -top-1 size-4 rounded-full'>
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='min-w-56 p-1'>
        <div className='flex items-center justify-between px-2 py-1'>
          <div className='text-sm font-medium'>{t('notifications.title')}</div>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={markAllRead}
              aria-label='Mark all read'
            >
              {t('markall')}
            </Button>
            <Link to='/app/notifications' className='text-sm px-2 py-1'>
             {t('viewall')}
            </Link>
          </div>
        </div>

        <DropdownMenuSeparator />

        {list.length === 0 ? (
          <div className='px-3 py-2 text-sm text-muted-foreground'>
           {t('nonotifications')}
          </div>
        ) : (
          list.map((n) => (
            <DropdownMenuItem key={n.id} className='p-2'>
              <div className='flex items-start gap-2 w-full'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`text-sm font-medium ${n.read ? 'opacity-60' : ''}`}
                    >
                      {n.title}
                    </div>
                    <div className='text-xs text-muted-foreground ml-auto'>
                      {n.date}
                    </div>
                  </div>
                  {n.body && (
                    <div className='text-xs text-muted-foreground mt-1'>
                      {n.body}
                    </div>
                  )}
                </div>
                <div>
                  <Button
                    variant='ghost'
                    size='icon'
                    aria-label={n.read ? 'Mark unread' : 'Mark read'}
                    onClick={() => markRead(n.id)}
                  >
                    <IconMail
                      className={n.read ? 'opacity-50' : 'text-primary'}
                    />
                  </Button>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationsPopover;
