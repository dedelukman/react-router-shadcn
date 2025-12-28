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
