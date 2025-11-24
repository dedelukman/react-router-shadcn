import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '~/components/ui/sheet';
import { Button } from '~/components/ui/button';
import type { ConfirmMode } from './types';

interface DeleteConfirmationSheetProps {
  isOpen: boolean;
  mode: ConfirmMode;
  selectedCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationSheet({
  isOpen,
  mode,
  selectedCount,
  onClose,
  onConfirm,
}: DeleteConfirmationSheetProps) {
  const { t } = useTranslation();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side='bottom'>
        <SheetHeader>
          <SheetTitle>{t('notifications.deleteConfirm.title')}</SheetTitle>
          <SheetDescription>
            {mode === 'bulk' ? (
              <>
                {t('notifications.deleteConfirm.descriptionBulk', { count: selectedCount })}
              </>
            ) : (
              <>
                {t('notifications.deleteConfirm.descriptionSingle')}
              </>
            )}
          </SheetDescription>
        </SheetHeader>
        <div className='p-4'>
          <div className='flex gap-2 justify-end'>
            <Button variant='outline' onClick={onClose}>
              {t('notifications.deleteConfirm.cancel')}
            </Button>
            <Button onClick={onConfirm} variant='destructive'>
              {t('notifications.deleteConfirm.delete')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}