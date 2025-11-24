import { useTranslation } from 'react-i18next';
import { Card } from '~/components/ui/card';
import InvoiceTable from './invoice-table';
import Pagination from './pagination';
import type { Invoice } from './types';

interface BillingHistoryProps {
  invoices: Invoice[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onViewInvoice: (invoice: Invoice) => void;
  onDownloadInvoice: (invoice: Invoice) => void;
  onPayInvoice: (invoiceId: string) => void;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
}

export default function BillingHistory({
  invoices,
  pageIndex,
  pageSize,
  totalItems,
  onViewInvoice,
  onDownloadInvoice,
  onPayInvoice,
  onPageSizeChange,
  onPageChange,
}: BillingHistoryProps) {
  const { t } = useTranslation();

  const pageCount = Math.ceil(totalItems / pageSize);

  return (
    <Card className='p-4' >
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h2 className='text-lg font-semibold'>
            {t('billing.billingHistory.title')}
          </h2>
          <div className='text-sm text-muted-foreground'>
            {t('billing.billingHistory.description')}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <label className='text-sm text-muted-foreground'>
            {t('billing.billingHistory.rowsPerPage')}
          </label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className='input'
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      
        <InvoiceTable
        invoices={invoices}
        onViewInvoice={onViewInvoice}
        onDownloadInvoice={onDownloadInvoice}
        onPayInvoice={onPayInvoice}
      />

      <Pagination
        currentPage={pageIndex}
        totalPages={pageCount}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />

      
    </Card>
  );
}
