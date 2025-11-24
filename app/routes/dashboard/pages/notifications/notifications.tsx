import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '~/components/ui/card';
import { toast } from 'sonner';

import NotificationsHeader from './notifications-header';
import NotificationsTabs from './notifications-tabs';
import NotificationsToolbar from './notifications-toolbar';
import NotificationsList from './notifications-list';
import DeleteConfirmationSheet from './delete-confirmation-sheet';

import type {
  Notification,
  NotificationTab,
  ConfirmMode,
  NotificationCounts,
} from './types';
import  {
  SAMPLE_NOTIFICATIONS,
} from './types';

export default function Notifications() {
  const { t } = useTranslation();

  const [items, setItems] = React.useState<Notification[]>(() => {
    try {
      const raw = localStorage.getItem('app_notifications');
      return raw ? (JSON.parse(raw) as Notification[]) : SAMPLE_NOTIFICATIONS;
    } catch {
      return SAMPLE_NOTIFICATIONS;
    }
  });

  const [activeTab, setActiveTab] = React.useState<NotificationTab>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmMode, setConfirmMode] = React.useState<ConfirmMode>('single');
  const [targetId, setTargetId] = React.useState<string | null>(null);

  // Persist to localStorage and sync across tabs
  React.useEffect(() => {
    try {
      localStorage.setItem('app_notifications', JSON.stringify(items));
      window.dispatchEvent(new Event('app_notifications_changed'));
    } catch {}
  }, [items]);

  React.useEffect(() => {
    function handleUpdate() {
      try {
        const raw = localStorage.getItem('app_notifications');
        const parsed = raw ? (JSON.parse(raw) as Notification[]) : SAMPLE_NOTIFICATIONS;
        const a = JSON.stringify(parsed || []);
        const b = JSON.stringify(items || []);
        if (a !== b) setItems(parsed);
      } catch {}
    }

    function onStorage(e: StorageEvent) {
      if (e.key === 'app_notifications') handleUpdate();
    }

    window.addEventListener('app_notifications_changed', handleUpdate);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('app_notifications_changed', handleUpdate);
      window.removeEventListener('storage', onStorage);
    };
  }, [items]);

  // Calculate counts
  const counts: NotificationCounts = React.useMemo(() => {
    const all = items.filter((i) => !i.archived).length;
    const fav = items.filter((i) => i.favorite && !i.archived).length;
    const archived = items.filter((i) => i.archived).length;
    const unread = items.filter((i) => !i.read && !i.archived).length;
    return { all, fav, archived, unread };
  }, [items]);

  // Filter notifications based on tab and search
  const filteredNotifications = React.useMemo(() => {
    return items
      .filter((it) => {
        if (activeTab === 'favorites') return it.favorite && !it.archived;
        if (activeTab === 'archived') return it.archived;
        return !it.archived; // 'all' tab
      })
      .filter((it) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          it.title.toLowerCase().includes(q) ||
          (it.body || '').toLowerCase().includes(q)
        );
      });
  }, [items, activeTab, searchQuery]);

  // Notification actions
  const toggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, favorite: !it.favorite } : it))
    );
    toast.success(t('notifications.toast.toggledFavorite'));
  };

  const toggleArchive = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, archived: !it.archived } : it))
    );
    toast(t('notifications.toast.archivedUpdated'));
  };

  const toggleRead = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, read: !it.read } : it))
    );
    toast(t('notifications.toast.readUpdated'));
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((f) => f.id));
    }
  };

  const handleBulkMarkRead = () => {
    setItems((prev) =>
      prev.map((it) =>
        selectedIds.includes(it.id) ? { ...it, read: true } : it
      )
    );
    toast.success(t('notifications.toast.bulkMarkedRead', { count: selectedIds.length }));
    setSelectedIds([]);
  };

  // Delete operations
  const openDeleteConfirmSingle = (id: string) => {
    setTargetId(id);
    setConfirmMode('single');
    setConfirmOpen(true);
  };

  const openDeleteConfirmBulk = () => {
    setConfirmMode('bulk');
    setConfirmOpen(true);
  };

  const performDelete = () => {
    if (confirmMode === 'single' && targetId) {
      setItems((prev) => prev.filter((it) => it.id !== targetId));
      setSelectedIds((s) => s.filter((id) => id !== targetId));
      toast.success(t('notifications.toast.deleted'));
    }

    if (confirmMode === 'bulk') {
      setItems((prev) => prev.filter((it) => !selectedIds.includes(it.id)));
      setSelectedIds([]);
      toast.success(t('notifications.toast.bulkDeleted', { count: selectedIds.length }));
    }

    setConfirmOpen(false);
  };

  return (
    <div className='m-2 space-y-4'>
      <Card>
        <NotificationsHeader
          totalCount={counts.all}
          unreadCount={counts.unread}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <CardContent>
          <NotificationsTabs
            activeTab={activeTab}
            counts={counts}
            onTabChange={setActiveTab}
          />

          <NotificationsToolbar
            selectedCount={selectedIds.length}
            totalCount={filteredNotifications.length}
            onSelectAll={handleSelectAll}
            onBulkMarkRead={handleBulkMarkRead}
            onBulkDelete={openDeleteConfirmBulk}
          />

          <NotificationsList
            notifications={filteredNotifications}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelectOne}
            onToggleFavorite={toggleFavorite}
            onToggleArchive={toggleArchive}
            onToggleRead={toggleRead}
            onDelete={openDeleteConfirmSingle}
          />
        </CardContent>
      </Card>

      <DeleteConfirmationSheet
        isOpen={confirmOpen}
        mode={confirmMode}
        selectedCount={confirmMode === 'bulk' ? selectedIds.length : 1}
        onClose={() => setConfirmOpen(false)}
        onConfirm={performDelete}
      />
    </div>
  );
}