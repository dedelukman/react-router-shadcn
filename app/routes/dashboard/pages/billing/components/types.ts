export type InvoiceStatus = 'paid' | 'pending' | 'failed';

export type Invoice = {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: InvoiceStatus;
};

export type Plan = {
  id: string;
  name: string;
  price: string;
  desc: string;
};

export const PLANS: Plan[] = [
  { id: 'basic', name: 'Basic', price: '$0 / mo', desc: 'For personal use' },
  { id: 'pro', name: 'Pro', price: '$12 / mo', desc: 'For professionals' },
  { id: 'enterprise', name: 'Enterprise', price: 'Contact', desc: 'For teams' },
];

export const SAMPLE_INVOICES: Invoice[] = Array.from({ length: 37 }).map((_, i) => ({
  id: `INV-${1000 + i}`,
  date: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toLocaleDateString(),
  plan: i % 3 === 0 ? 'Pro' : i % 3 === 1 ? 'Basic' : 'Enterprise',
  amount: `$${(9.99 + (i % 5) * 5).toFixed(2)}`,
  status: i % 4 === 0 ? 'pending' : 'paid',
}));