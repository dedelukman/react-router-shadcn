import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { IconSearch, IconBell } from '@tabler/icons-react';

interface NotificationsHeaderProps {
  totalCount: number;
  unreadCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function NotificationsHeader({
  totalCount,
  unreadCount,
  searchQuery,
  onSearchChange,
}: NotificationsHeaderProps) {
  const { t } = useTranslation();

  return (
    <CardHeader className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        <IconBell className='size-5' />
        <div>
          <CardTitle>{t('notifications.title')}</CardTitle>
          <div 
            className='text-sm text-muted-foreground'
            dangerouslySetInnerHTML={{
              __html: t('notifications.subtitle', { count: totalCount })
            }}
          />
          <span className='ml-2 text-sm'>
            <Badge variant='secondary'>
              {t('notifications.unread', { count: unreadCount })}
            </Badge>
          </span>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2'>
          <Input
            placeholder={t('notifications.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className='max-w-sm'
            spellCheck={false}
          />
          <Button variant='ghost' aria-label={t('notifications.actions.search')}>
            <IconSearch />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}