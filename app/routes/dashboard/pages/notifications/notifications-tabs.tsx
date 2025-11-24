import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Badge } from '~/components/ui/badge';
import type { NotificationCounts, NotificationTab } from './types';

interface NotificationsTabsProps {
  activeTab: NotificationTab;
  counts: NotificationCounts;
  onTabChange: (tab: NotificationTab) => void;
}

export default function NotificationsTabs({
  activeTab,
  counts,
  onTabChange,
}: NotificationsTabsProps) {
  const { t } = useTranslation();

  return (
    <div className='mb-4'>
      <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as NotificationTab)}>
        <TabsList>
          <TabsTrigger value='all'>
            {t('notifications.tabs.all')} <Badge className='ml-2'>{counts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value='favorites'>
            {t('notifications.tabs.favorites')} <Badge className='ml-2'>{counts.fav}</Badge>
          </TabsTrigger>
          <TabsTrigger value='archived'>
            {t('notifications.tabs.archived')} <Badge className='ml-2'>{counts.archived}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}