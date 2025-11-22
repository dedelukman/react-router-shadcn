import * as React from 'react';
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
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Choose a plan that fits your needs.
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
                      <div className='font-medium'>{p.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {p.desc}
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Badge variant='outline' className='text-sm'>
                        {p.price}
                      </Badge>
                      <input
                        type='radio'
                        name='plan'
                        value={p.id}
                        checked={active}
                        onChange={() => setSelectedPlan(p.id)}
                        className='sr-only'
                        aria-label={p.name}
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
          </CardFooter>
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

          <Table className='text-sm'>
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
                  <TableCell>
                    {inv.status === 'paid' ? (
                      <Badge
                        className='border-green-200 text-green-700'
                        variant='outline'
                      >
                        Paid
                      </Badge>
                    ) : inv.status === 'pending' ? (
                      <Badge
                        className='border-orange-200 text-orange-700'
                        variant='outline'
                      >
                        Pending
                      </Badge>
                    ) : (
                      <Badge
                        className='border-red-200 text-red-700'
                        variant='outline'
                      >
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        onClick={() => viewInvoice(inv)}
                      >
                        <IconEye className='size-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon-sm'
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
