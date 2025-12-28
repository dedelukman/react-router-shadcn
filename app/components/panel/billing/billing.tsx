import * as React from 'react';
import PlanCard from './plan-card';
import BillingHistory from './billing-history';

import {
  useGetBillingPlansQuery,
  useGetBillingInvoicesQuery,
  usePayInvoiceMutation,
} from '../../../store/api/billing.api';

import {
  useGetCurrentSubscriptionQuery,
  useSubscribePlanMutation,
} from '../../../store/api/subscription.api';

import { mapPlan, mapInvoice, type Plan, type Invoice } from '../../../domain/billing';

export default function BillingPage() {
  const { data: plansApi = [] } = useGetBillingPlansQuery();
  const { data: invoicesApi = [] } = useGetBillingInvoicesQuery();
  const { data: subscription } = useGetCurrentSubscriptionQuery();

  const [subscribe] = useSubscribePlanMutation();
  const [payInvoice] = usePayInvoiceMutation();

  const plans: Plan[] = plansApi.map(mapPlan);
  const invoices: Invoice[] = invoicesApi.map(mapInvoice);

  const [selectedPlan, setSelectedPlan] = React.useState(
    subscription?.plan?.toLowerCase() ?? 'basic'
  );

  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const pagedInvoices = React.useMemo(() => {
    const start = pageIndex * pageSize;
    return invoices.slice(start, start + pageSize);
  }, [invoices, pageIndex, pageSize]);

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
      plans ={plans}
        selectedPlan={selectedPlan}
        currentPlan={subscription?.plan?.toLowerCase() ?? 'basic'}
        onPlanChange={setSelectedPlan}
        onUpdatePlan={() => subscribe(selectedPlan.toUpperCase())}
        onResetPlan={() =>
          setSelectedPlan(subscription?.plan?.toLowerCase() ?? 'basic')
        }
      />
      </div>

<div className='lg:col-span-2'> 
    <BillingHistory
        invoices={invoices}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={invoices.length}
        onViewInvoice={(i) => console.log('view', i)}
        onDownloadInvoice={(i) => console.log('download', i)}
        onPayInvoice={(id) => payInvoice(id)}
        onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
      />
</div>
    
    </div>
  );
}
