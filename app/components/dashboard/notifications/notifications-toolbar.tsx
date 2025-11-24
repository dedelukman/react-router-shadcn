import { useTranslation } from 'react-i18next';
import { Checkbox } from '~/components/ui/checkbox';
import { Button } from '~/components/ui/button';
import { IconMail, IconTrash } from '@tabler/icons-react';

interface NotificationsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onBulkMarkRead: () => void;
  onBulkDelete: () => void;
}

export default function NotificationsToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onBulkMarkRead,
  onBulkDelete,
}: NotificationsToolbarProps) {
  const { t } = useTranslation();

  const selectionState = 
    totalCount > 0 && selectedCount === totalCount
      ? true
      : selectedCount > 0 && selectedCount < totalCount
        ? 'indeterminate'
        : false;

  return (
    <div className='mb-4 flex items-center justify-between'>
      <div />
      <div className='flex items-center gap-2'>
        <Checkbox
          checked={selectionState}
          onCheckedChange={onSelectAll}
          aria-label={t('notifications.actions.selectAll')}
        />
        <Button
          variant='ghost'
          onClick={onBulkMarkRead}
          disabled={selectedCount === 0}
          aria-label={t('notifications.actions.markSelectedRead')}
        >
          <IconMail />
        </Button>
        <Button
          variant='ghost'
          onClick={onBulkDelete}
          disabled={selectedCount === 0}
          aria-label={t('notifications.actions.deleteSelected')}
        >
          <IconTrash />
        </Button>
      </div>
    </div>
  );
}