import * as React from 'react';
import { useTranslation } from 'react-i18next';
import PlanCard from './components/plan-card';
import BillingHistory from './components/billing-history';
import type { Invoice } from './components/types';
import {  SAMPLE_INVOICES } from './components/types';

export default function Billing() {
  const { t } = useTranslation();

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

  React.useEffect(() => {
    try {
      localStorage.setItem('billing_plan', selectedPlan);
    } catch {}
  }, [selectedPlan]);

  const pagedInvoices = React.useMemo(() => {
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

  function handlePlanChange(planId: string) {
    setSelectedPlan(planId);
  }

  function handleUpdatePlan() {
    alert(t('billing.subscription.success.subscribed', { plan: selectedPlan }));
  }

  function handleResetPlan() {
    setSelectedPlan('basic');
    localStorage.removeItem('billing_plan');
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPageIndex(0);
  }

  function handlePageChange(page: number) {
    setPageIndex(page);
  }

  return (
    <div className='m-2 grid grid-cols-1 lg:grid-cols-3 gap-6'>
      <div className='lg:col-span-1'>
        <PlanCard
          selectedPlan={selectedPlan}
          onPlanChange={handlePlanChange}
          onUpdatePlan={handleUpdatePlan}
          onResetPlan={handleResetPlan}
        />
      </div>

      <div className='lg:col-span-2'>
        <BillingHistory
          invoices={pagedInvoices}
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalItems={invoices.length}
          onViewInvoice={viewInvoice}
          onDownloadInvoice={downloadInvoice}
          onPayInvoice={payInvoice}
          onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}