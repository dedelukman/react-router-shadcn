import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { IconDownload, IconEye, IconCreditCard } from '@tabler/icons-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from '~/components/ui/table';
import { useAuth } from '~/lib/auth';

type Invoice = {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
};

const SAMPLE_INVOICES: Invoice[] = Array.from({ length: 37 }).map((_, i) => ({
  id: `INV-${1000 + i}`,
  date: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toLocaleDateString(),
  plan: i % 3 === 0 ? 'Pro' : i % 3 === 1 ? 'Basic' : 'Enterprise',
  amount: `$${(9.99 + (i % 5) * 5).toFixed(2)}`,
  status: i % 4 === 0 ? 'pending' : 'paid',
}));

const PLANS = [
  { id: 'basic', name: 'Basic', price: '$0 / mo', desc: 'For personal use' },
  { id: 'pro', name: 'Pro', price: '$12 / mo', desc: 'For professionals' },
  { id: 'enterprise', name: 'Enterprise', price: 'Contact', desc: 'For teams' },
];

export default function Page() {
  const { t } = useTranslation();
  const auth = (() => {
    try {
      return useAuth();
    } catch {
      return null;
    }
  })();

  const [selectedPlan, setSelectedPlan] = React.useState<string>(() => {
    try {
      return localStorage.getItem('billing_plan') || 'basic';
    } catch {
      return 'basic';
    }
  });

  const [invoices, setInvoices] = React.useState<Invoice[]>(SAMPLE_INVOICES);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const pageCount = Math.ceil(invoices.length / pageSize);

  React.useEffect(() => {
    try {
      localStorage.setItem('billing_plan', selectedPlan);
    } catch {}
  }, [selectedPlan]);

  const paged = React.useMemo(() => {
    const start = pageIndex * pageSize;
    return invoices.slice(start, start + pageSize);
  }, [invoices, pageIndex, pageSize]);

  function viewInvoice(inv: Invoice) {
    alert(
      t('billing.invoice.alert', {
        id: inv.id,
        date: inv.date,
        plan: inv.plan,
        amount: inv.amount,
        status: inv.status,
      })
    );
  }

  function downloadInvoice(inv: Invoice) {
    const blob = new Blob([JSON.stringify(inv, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function payInvoice(id: string) {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'paid' } : i))
    );
  }

  const getTranslatedPlan = (planId: string) => {
    return t(`billing.subscription.plans.${planId}.name`, { defaultValue: planId });
  };

  const getTranslatedStatus = (status: string) => {
    return t(`billing.billingHistory.statuses.${status}`, { defaultValue: status });
  };

  return (
    <div className='m-2 grid grid-cols-1 lg:grid-cols-3 gap-6'>
      <div className='lg:col-span-1'>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{t('billing.subscription.title')}</CardTitle>
              <CardDescription>
                {t('billing.subscription.description')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-3'>
              {PLANS.map((p) => {
                const active = selectedPlan === p.id;
                return (
                  <label
                    key={p.id}
                    className={
                      `flex items-center justify-between gap-4 p-3 rounded-md border transition-colors cursor-pointer ` +
                      (active
                        ? 'bg-muted/10 border-primary'
                        : 'hover:bg-muted/5 border-border')
                    }
                    onClick={() => setSelectedPlan(p.id)}
                  >
                    <div>
                      <div className='font-medium'>
                        {t(`billing.subscription.plans.${p.id}.name`)}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {t(`billing.subscription.plans.${p.id}.desc`)}
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Badge variant='outline' className='text-sm'>
                        {t(`billing.subscription.plans.${p.id}.price`)}
                      </Badge>
                      <input
                        type='radio'
                        name='plan'
                        value={p.id}
                        checked={active}
                        onChange={() => setSelectedPlan(p.id)}
                        className='sr-only'
                        aria-label={t(`billing.subscription.plans.${p.id}.name`)}
                      />
                      <div
                        className={
                          active
                            ? 'h-4 w-4 rounded-full bg-primary'
                            : 'h-4 w-4 rounded-full border'
                        }
                        aria-hidden
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <div className='flex items-center gap-2'>
              <Button onClick={() => alert(t('billing.subscription.success.subscribed', { plan: selectedPlan }))}>
                {t('billing.subscription.updatePlan')}
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setSelectedPlan('basic');
                  localStorage.removeItem('billing_plan');
                }}
              >
                {t('billing.subscription.reset')}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className='lg:col-span-2'>
        <Card className='p-4'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-lg font-semibold'>{t('billing.billingHistory.title')}</h2>
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
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageIndex(0);
                }}
                className='input'
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

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
              {paged.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.id}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>{getTranslatedPlan(inv.plan.toLowerCase())}</TableCell>
                  <TableCell className='text-right'>{inv.amount}</TableCell>
                  <TableCell>
                    {inv.status === 'paid' ? (
                      <Badge
                        className='border-green-200 text-green-700'
                        variant='outline'
                      >
                        {getTranslatedStatus('paid')}
                      </Badge>
                    ) : inv.status === 'pending' ? (
                      <Badge
                        className='border-orange-200 text-orange-700'
                        variant='outline'
                      >
                        {getTranslatedStatus('pending')}
                      </Badge>
                    ) : (
                      <Badge
                        className='border-red-200 text-red-700'
                        variant='outline'
                      >
                        {getTranslatedStatus('failed')}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        onClick={() => viewInvoice(inv)}
                        title={t('billing.billingHistory.actionsList.view')}
                      >
                        <IconEye className='size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        onClick={() => downloadInvoice(inv)}
                        title={t('billing.billingHistory.actionsList.download')}
                      >
                        <IconDownload className='size-4' />
                      </Button>
                      {inv.status === 'pending' && (
                        <Button 
                          size='sm' 
                          onClick={() => payInvoice(inv.id)}
                          title={t('billing.billingHistory.actionsList.pay')}
                        >
                          <IconCreditCard className='size-4 mr-2' />
                          {t('billing.billingHistory.actionsList.pay')}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              {t('billing.billingHistory.showing', {
                start: pageIndex * pageSize + 1,
                end: Math.min((pageIndex + 1) * pageSize, invoices.length),
                total: invoices.length
              })}
            </TableCaption>
          </Table>

          <div className='flex items-center justify-between mt-4'>
            <div className='text-sm text-muted-foreground'>
              {t('billing.billingHistory.page', {
                current: pageIndex + 1,
                total: pageCount
              })}
            </div>
            <div className='flex items-center gap-2'>
              <Button
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              >
                {t('billing.billingHistory.previous')}
              </Button>
              <Button
                disabled={pageIndex >= pageCount - 1}
                onClick={() =>
                  setPageIndex((p) => Math.min(pageCount - 1, p + 1))
                }
              >
                {t('billing.billingHistory.next')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}