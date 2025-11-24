import { useTranslation } from 'react-i18next';
import NotificationItem from './notifications-item';
import type { Notification } from '../../../lib/types';

interface NotificationsListProps {
  notifications: Notification[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationsList({
  notifications,
  selectedIds,
  onToggleSelect,
  onToggleFavorite,
  onToggleArchive,
  onToggleRead,
  onDelete,
}: NotificationsListProps) {
  const { t } = useTranslation();

  if (notifications.length === 0) {
    return (
      <div className='text-sm text-muted-foreground'>
        {t('notifications.noNotifications')}
      </div>
    );
  }

  return (
    <div className='grid gap-3'>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          isSelected={selectedIds.includes(notification.id)}
          onToggleSelect={onToggleSelect}
          onToggleFavorite={onToggleFavorite}
          onToggleArchive={onToggleArchive}
          onToggleRead={onToggleRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}