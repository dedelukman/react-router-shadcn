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
import {
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
} from '~/store/api';
import type { NotificationResponse } from '~/store/types';

export function NotificationsPopover() {
  const { t } = useTranslation();
  const { data: notifications = [], isLoading } = useGetNotificationsQuery(
    undefined,
    {
      pollingInterval: 5000, // Poll every 5 seconds for real-time updates
    }
  );
  const [updateNotification] = useUpdateNotificationMutation();

  // Only count unread non-archived notifications
  const unreadCount = React.useMemo(
    () => notifications.filter((i) => !i.read && !i.archived).length,
    [notifications]
  );

  // Prioritize unread notifications first, then show read ones to fill up to 5 total
  const list = React.useMemo(() => {
    const nonArchived = notifications.filter((i) => !i.archived);
    const unread = nonArchived.filter((i) => !i.read);
    const read = nonArchived.filter((i) => i.read);

    // Combine: unread first, then read to reach max 5
    return [...unread, ...read].slice(0, 5);
  }, [notifications]);

  async function markRead(id: number) {
    try {
      await updateNotification({
        id,
        body: { read: true },
      }).unwrap();
      toast.success(t('notifications.toast.readUpdated'));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  }

  async function markAllRead() {
    try {
      const unreadNotifications = notifications.filter(
        (n) => !n.read && !n.archived
      );
      await Promise.all(
        unreadNotifications.map((n) =>
          updateNotification({
            id: n.id as number,
            body: { read: true },
          }).unwrap()
        )
      );
      toast.success('All notifications marked read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  }

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
              disabled={isLoading}
            >
              {t('markall')}
            </Button>
            <Link to='/app/notifications' className='text-sm px-2 py-1'>
              {t('viewall')}
            </Link>
          </div>
        </div>

        <DropdownMenuSeparator />

        {isLoading ? (
          <div className='px-3 py-2 text-sm text-muted-foreground'>
            Loading...
          </div>
        ) : list.length === 0 ? (
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
                      className={`text-sm font-medium ${
                        n.read ? 'opacity-60' : ''
                      }`}
                    >
                      {n.title}
                    </div>
                    <div className='text-xs text-muted-foreground ml-auto'>
                      {new Date(n.createdAt).toLocaleDateString()}
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
                    onClick={() => markRead(n.id as number)}
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
