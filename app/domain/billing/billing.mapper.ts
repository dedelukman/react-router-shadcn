import type { BillingPlan, BillingInvoice } from '../../store/api/billing.api';
import type { Plan, Invoice } from './billing.types';



export function mapInvoice(api: BillingInvoice): Invoice {
     const formattedPrice = api.amount > 0 
    ? formatCurrency(api.amount, api.currency) 
    :'' ;
  return {
    id: api.invoiceNumber,
    date: new Date(api.invoiceDate).toLocaleDateString(),
    plan: api.plan,
    amount: formattedPrice,
    status:
      api.status === 'PAID'
        ? 'paid'
        : api.status === 'UNPAID'
        ? 'pending'
        : 'failed',
  };
}

export function mapPlan(api: BillingPlan): Plan {
  const formattedPrice = api.price > 0 
    ? formatCurrency(api.price, api.currency) 
    :'' ;
  
  return {
    id: api.code.toLowerCase(),
    name: api.name,
    price: formattedPrice,
    desc: api.description ?? '',
  };
}

function formatCurrency(amount: number, currency: string): string {
  // Format angka dengan pemisah ribuan
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
  
  // Tambahkan simbol mata uang
  switch (currency.toUpperCase()) {
    case 'IDR':
      return `Rp ${formattedAmount}`;
    case 'USD':
      return `$${new Intl.NumberFormat('en-US').format(amount)}`;
    case 'EUR':
      return `€${new Intl.NumberFormat('en-US').format(amount)}`;
    case 'GBP':
      return `£${new Intl.NumberFormat('en-US').format(amount)}`;
    default:
      // Fallback untuk mata uang lain
      return `${currency} ${formattedAmount}`;
  }
}
