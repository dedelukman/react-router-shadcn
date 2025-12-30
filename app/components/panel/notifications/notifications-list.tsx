import { useTranslation } from 'react-i18next';
import NotificationItem from './notifications-item';
import type { Notification } from './types';

interface NotificationsListProps {
  notifications: Notification[];
  selectedIds: (string | number)[];
  onToggleSelect: (id: string | number) => void;
  onToggleFavorite: (id: string | number) => void;
  onToggleArchive: (id: string | number) => void;
  onToggleRead: (id: string | number) => void;
  onDelete: (id: string | number) => void;
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
