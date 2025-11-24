import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '~/components/ui/checkbox';
import { Button } from '~/components/ui/button';
import {
  IconTrash,
  IconArchive,
  IconMail,
  IconStar,
} from '@tabler/icons-react';
import type { Notification } from './types';

interface NotificationItemProps {
  notification: Notification;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({
  notification,
  isSelected,
  onToggleSelect,
  onToggleFavorite,
  onToggleArchive,
  onToggleRead,
  onDelete,
}: NotificationItemProps) {
  const { t } = useTranslation();

  return (
    <div className='flex items-start justify-between gap-4 rounded-md border p-3'>
      <div className='flex items-start gap-3'>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(notification.id)}
          aria-label={`${t('notifications.actions.selectAll')} ${notification.title}`}
        />
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <div className='font-medium'>{notification.title}</div>
            <div className='text-xs text-muted-foreground'>
              {notification.date}
            </div>
          </div>
          {notification.body && (
            <div className='text-sm text-muted-foreground mt-1'>
              {notification.body}
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-col items-end gap-2'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            aria-label={notification.read ? t('notifications.actions.markUnread') : t('notifications.actions.markRead')}
            onClick={() => onToggleRead(notification.id)}
          >
            <IconMail
              className={notification.read ? 'opacity-50' : 'text-primary'}
            />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            aria-label={notification.favorite ? t('notifications.actions.unfavorite') : t('notifications.actions.favorite')}
            onClick={() => onToggleFavorite(notification.id)}
          >
            <IconStar
              className={notification.favorite ? 'text-yellow-500' : ''}
            />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            aria-label={notification.archived ? t('notifications.actions.unarchive') : t('notifications.actions.archive')}
            onClick={() => onToggleArchive(notification.id)}
          >
            <IconArchive 
              className={notification.archived ? 'opacity-50' : ''}
            />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            aria-label={t('notifications.actions.delete')}
            onClick={() => onDelete(notification.id)}
          >
            <IconTrash />
          </Button>
        </div>
      </div>
    </div>
  );
}