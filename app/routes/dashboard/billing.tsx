import * as React from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
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
      `Invoice ${inv.id}\nDate: ${inv.date}\nPlan: ${inv.plan}\nAmount: ${inv.amount}\nStatus: ${inv.status}`
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

  return (
    <div className='m-2 grid grid-cols-1 lg:grid-cols-3 gap-6'>
      <div className='lg:col-span-1'>
        <Card className='p-4'>
          <h2 className='text-lg font-semibold'>Subscription</h2>
          <p className='text-muted-foreground text-sm mb-4'>
            Choose a plan that fits your needs.
          </p>

          <div className='flex flex-col gap-3'>
            {PLANS.map((p) => (
              <label
                key={p.id}
                className='border rounded-md p-3 flex items-center justify-between'
              >
                <div>
                  <div className='font-medium'>{p.name}</div>
                  <div className='text-sm text-muted-foreground'>{p.desc}</div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-sm text-muted-foreground'>{p.price}</div>
                  <input
                    type='radio'
                    name='plan'
                    value={p.id}
                    checked={selectedPlan === p.id}
                    onChange={() => setSelectedPlan(p.id)}
                    className='radio'
                  />
                </div>
              </label>
            ))}
          </div>

          <div className='mt-4 flex gap-2'>
            <Button onClick={() => alert(`Subscribed to ${selectedPlan}`)}>
              Update Plan
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                setSelectedPlan('basic');
                localStorage.removeItem('billing_plan');
              }}
            >
              Reset
            </Button>
          </div>
        </Card>
      </div>

      <div className='lg:col-span-2'>
        <Card className='p-4'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-lg font-semibold'>Billing history</h2>
              <div className='text-sm text-muted-foreground'>
                Invoices and payments
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <label className='text-sm text-muted-foreground'>Rows:</label>
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.id}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>{inv.plan}</TableCell>
                  <TableCell className='text-right'>{inv.amount}</TableCell>
                  <TableCell
                    className={
                      inv.status === 'paid'
                        ? 'text-green-500'
                        : inv.status === 'pending'
                          ? 'text-orange-500'
                          : 'text-red-500'
                    }
                  >
                    {inv.status}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => viewInvoice(inv)}
                      >
                        <IconEye className='size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => downloadInvoice(inv)}
                      >
                        <IconDownload className='size-4' />
                      </Button>
                      {inv.status === 'pending' && (
                        <Button size='sm' onClick={() => payInvoice(inv.id)}>
                          <IconCreditCard className='size-4 mr-2' />
                          Pay
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>{`Showing ${pageIndex * pageSize + 1} - ${Math.min((pageIndex + 1) * pageSize, invoices.length)} of ${invoices.length}`}</TableCaption>
          </Table>

          <div className='flex items-center justify-between mt-4'>
            <div className='text-sm text-muted-foreground'>
              Page {pageIndex + 1} of {pageCount}
            </div>
            <div className='flex items-center gap-2'>
              <Button
                disabled={pageIndex === 0}
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                disabled={pageIndex >= pageCount - 1}
                onClick={() =>
                  setPageIndex((p) => Math.min(pageCount - 1, p + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
