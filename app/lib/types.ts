// --- GET HELP ---
export type Priority = 'Low' | 'Normal' | 'High' | 'Critical';
export type Category =
  | 'Bug/Error'
  | 'Feature Question'
  | 'Feature Request'
  | 'Account'
  | 'Payment'
  | 'Other';

export type TicketStatus =
  | 'Open'
  | 'Responded'
  | 'Investigating'
  | 'Pending'
  | 'Done'
  | 'Closed';

export type Ticket = {
  id: string;
  subject: string;
  category: Category | string;
  priority: Priority;
  description: string;
  attachment?: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
};

export const defaultCategories: Category[] = [
  'Bug/Error',
  'Feature Question',
  'Feature Request',
  'Account',
  'Payment',
  'Other',
];

export const defaultPriorities: Priority[] = ['Low', 'Normal', 'High', 'Critical'];


// --- BILLING ---
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


// --- NOTIFICATIONS ---
export type NotificationTab = 'all' | 'favorites' | 'archived';
export type ConfirmMode = 'single' | 'bulk';

export interface Notification {
  id: string;
  title: string;
  body?: string;
  date: string;
  favorite?: boolean;
  archived?: boolean;
  read?: boolean;
}

export interface NotificationCounts {
  all: number;
  fav: number;
  archived: number;
  unread: number;
}

export const SAMPLE_NOTIFICATIONS: Notification[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `n-${i}`,
  title: `Notification ${i + 1}`,
  body: `This is the detail for notification ${i + 1}.`,
  date: new Date(Date.now() - i * 1000 * 60 * 60).toLocaleString(),
  favorite: i % 5 === 0,
  archived: i % 7 === 0,
  read: i % 3 === 0,
}));
