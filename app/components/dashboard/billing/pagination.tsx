import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation();

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <>
      <div className='text-sm text-muted-foreground text-center'>
        {t('billing.billingHistory.showing', {
          start: startItem,
          end: endItem,
          total: totalItems
        })}
      </div>

      <div className='flex items-center justify-between mt-4'>
        <div className='text-sm text-muted-foreground'>
          {t('billing.billingHistory.page', {
            current: currentPage + 1,
            total: totalPages
          })}
        </div>
        <div className='flex items-center gap-2'>
          <Button
            disabled={currentPage === 0}
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          >
            {t('billing.billingHistory.previous')}
          </Button>
          <Button
            disabled={currentPage >= totalPages - 1}
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          >
            {t('billing.billingHistory.next')}
          </Button>
        </div>
      </div>
    </>
  );
}