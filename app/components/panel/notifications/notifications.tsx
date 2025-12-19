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
  NotificationResponse,
} from '../../../lib/types';
import {
  useGetNotificationsQuery,
  useGetFavoriteNotificationsQuery,
  useGetArchivedNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} from '../../../lib/api';

export default function Notifications() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = React.useState<NotificationTab>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<(string | number)[]>([]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmMode, setConfirmMode] = React.useState<ConfirmMode>('single');
  const [targetId, setTargetId] = React.useState<string | number | null>(null);

  // Fetch notifications from API based on active tab
  const { data: allNotifications = [], isLoading: isLoadingAll } =
    useGetNotificationsQuery();
  const { data: favoriteNotifications = [], isLoading: isLoadingFav } =
    useGetFavoriteNotificationsQuery();
  const { data: archivedNotifications = [], isLoading: isLoadingArchived } =
    useGetArchivedNotificationsQuery();
  const [updateNotification] = useUpdateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  // Determine which data to use based on active tab
  const apiNotifications = React.useMemo(() => {
    if (activeTab === 'favorites') return favoriteNotifications;
    if (activeTab === 'archived') return archivedNotifications;
    return allNotifications;
  }, [
    activeTab,
    allNotifications,
    favoriteNotifications,
    archivedNotifications,
  ]);

  const isLoading =
    (activeTab === 'all' && isLoadingAll) ||
    (activeTab === 'favorites' && isLoadingFav) ||
    (activeTab === 'archived' && isLoadingArchived);

  // Map API response to local format
  const items: Notification[] = React.useMemo(() => {
    return apiNotifications.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      date: new Date(n.createdAt).toLocaleString(),
      favorite: n.favorite || false,
      archived: n.archived || false,
      read: n.read || false,
    }));
  }, [apiNotifications]);

  // Calculate counts - use all data for accurate counts
  const counts: NotificationCounts = React.useMemo(() => {
    const all = allNotifications.filter((i) => !i.archived).length;
    const fav = favoriteNotifications.length;
    const archived = archivedNotifications.length;
    const unread = allNotifications.filter(
      (i) => !i.read && !i.archived
    ).length;
    return { all, fav, archived, unread };
  }, [allNotifications, favoriteNotifications, archivedNotifications]);

  // Filter notifications based on search only (tab filtering already done via API)
  const filteredNotifications = React.useMemo(() => {
    return items.filter((it) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        it.title.toLowerCase().includes(q) ||
        (it.body || '').toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery]);

  // Notification actions
  const toggleFavorite = async (id: string | number) => {
    const notification = items.find((i) => i.id === id);
    if (notification) {
      try {
        await updateNotification({
          id: id as number,
          body: { favorite: !notification.favorite },
        }).unwrap();
        toast.success(t('notifications.toast.toggledFavorite'));
      } catch (error) {
        toast.error('Failed to update favorite');
      }
    }
  };

  const toggleArchive = async (id: string | number) => {
    const notification = items.find((i) => i.id === id);
    if (notification) {
      try {
        await updateNotification({
          id: id as number,
          body: { archived: !notification.archived },
        }).unwrap();
        toast.success(t('notifications.toast.archivedUpdated'));
      } catch (error) {
        toast.error('Failed to update archive status');
      }
    }
  };

  const toggleRead = async (id: string | number) => {
    const notification = items.find((i) => i.id === id);
    if (notification) {
      try {
        await updateNotification({
          id: id as number,
          body: { read: !notification.read },
        }).unwrap();
        toast.success(t('notifications.toast.readUpdated'));
      } catch (error) {
        toast.error('Failed to update read status');
      }
    }
  };

  const toggleSelectOne = (id: string | number) => {
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

  const handleBulkMarkRead = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          updateNotification({
            id: id as number,
            body: { read: true },
          }).unwrap()
        )
      );
      toast.success(
        t('notifications.toast.bulkMarkedRead', { count: selectedIds.length })
      );
      setSelectedIds([]);
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  // Delete operations
  const openDeleteConfirmSingle = (id: string | number) => {
    setTargetId(id);
    setConfirmMode('single');
    setConfirmOpen(true);
  };

  const openDeleteConfirmBulk = () => {
    setConfirmMode('bulk');
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    try {
      if (confirmMode === 'single' && targetId) {
        await deleteNotification(targetId as number).unwrap();
        setSelectedIds((s) => s.filter((id) => id !== targetId));
        toast.success(t('notifications.toast.deleted'));
      }

      if (confirmMode === 'bulk') {
        await Promise.all(
          selectedIds.map((id) => deleteNotification(id as number).unwrap())
        );
        setSelectedIds([]);
        toast.success(
          t('notifications.toast.bulkDeleted', { count: selectedIds.length })
        );
      }

      setConfirmOpen(false);
    } catch (error) {
      toast.error('Failed to delete notification(s)');
    }
  };

  if (isLoading) {
    return (
      <div className='m-2 space-y-4'>
        <Card>
          <CardContent className='py-8'>
            <div className='text-center text-muted-foreground'>Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
