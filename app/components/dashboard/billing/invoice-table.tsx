import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { IconDownload, IconEye, IconCreditCard } from '@tabler/icons-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '~/components/ui/table';
import type { Invoice } from '../../../lib/types';

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
  onDownloadInvoice: (invoice: Invoice) => void;
  onPayInvoice: (invoiceId: string) => void;
}

export default function InvoiceTable({ 
  invoices, 
  onViewInvoice, 
  onDownloadInvoice, 
  onPayInvoice 
}: InvoiceTableProps) {
  const { t } = useTranslation();

  const getTranslatedPlan = (planId: string) => {
    return t(`billing.subscription.plans.${planId.toLowerCase()}.name`, { 
      defaultValue: planId 
    });
  };

  const getTranslatedStatus = (status: string) => {
    return t(`billing.billingHistory.statuses.${status}`, { 
      defaultValue: status 
    });
  };

  return (
    <Table className='text-sm'>
      <TableHeader>
        <TableRow>
          <TableHead>{t('billing.billingHistory.invoice')}</TableHead>
          <TableHead>{t('billing.billingHistory.date')}</TableHead>
          <TableHead>{t('billing.billingHistory.plan')}</TableHead>
          <TableHead className='text-right'>{t('billing.billingHistory.amount')}</TableHead>
          <TableHead>{t('billing.billingHistory.status')}</TableHead>
          <TableHead>{t('billing.billingHistory.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <InvoiceRow
            key={invoice.id}
            invoice={invoice}
            onView={onViewInvoice}
            onDownload={onDownloadInvoice}
            onPay={onPayInvoice}
            getTranslatedPlan={getTranslatedPlan}
            getTranslatedStatus={getTranslatedStatus}
          />
        ))}
      </TableBody>
    </Table>
  );
}

interface InvoiceRowProps {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
  onPay: (invoiceId: string) => void;
  getTranslatedPlan: (planId: string) => string;
  getTranslatedStatus: (status: string) => string;
}

function InvoiceRow({ 
  invoice, 
  onView, 
  onDownload, 
  onPay, 
  getTranslatedPlan, 
  getTranslatedStatus 
}: InvoiceRowProps) {
  const { t } = useTranslation();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className='border-green-200 text-green-700' variant='outline'>
            {getTranslatedStatus('paid')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge className='border-orange-200 text-orange-700' variant='outline'>
            {getTranslatedStatus('pending')}
          </Badge>
        );
      case 'failed':
        return (
          <Badge className='border-red-200 text-red-700' variant='outline'>
            {getTranslatedStatus('failed')}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <TableRow key={invoice.id}>
      <TableCell>{invoice.id}</TableCell>
      <TableCell>{invoice.date}</TableCell>
      <TableCell>{getTranslatedPlan(invoice.plan)}</TableCell>
      <TableCell className='text-right'>{invoice.amount}</TableCell>
      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
      <TableCell>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon-sm'
            onClick={() => onView(invoice)}
            title={t('billing.billingHistory.actionsList.view')}
          >
            <IconEye className='size-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon-sm'
            onClick={() => onDownload(invoice)}
            title={t('billing.billingHistory.actionsList.download')}
          >
            <IconDownload className='size-4' />
          </Button>
          {invoice.status === 'pending' && (
            <Button 
              size='sm' 
              onClick={() => onPay(invoice.id)}
              title={t('billing.billingHistory.actionsList.pay')}
            >
              <IconCreditCard className='size-4 mr-2' />
              {t('billing.billingHistory.actionsList.pay')}
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}