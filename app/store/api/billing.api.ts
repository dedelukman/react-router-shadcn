import { baseApi } from './baseApi';
import { toast } from 'sonner';

/* =====================
 * TYPES
 * ===================== */

export interface BillingPlan {
  code: string;          // BASIC / PRO / ENTERPRISE
  name: string;
  price: number;         // monthly price
  currency: string;      // USD / IDR
  description?: string;
  features?: string[];
}

export interface BillingInvoice {
  invoiceNumber: string;
  plan: string;
  amount: number;
  currency: string;
  status: 'UNPAID' | 'PAID' | 'FAILED';
  periodStart: string;
  periodEnd: string;
  invoiceDate: string;
  paidAt?: string;
}

/* =====================
 * API
 * ===================== */

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET /api/billing/plans
    getBillingPlans: builder.query<BillingPlan[], void>({
      query: () => 'billing/plans',
      providesTags: ['BillingPlan'],
    }),

    // 🔹 GET /api/billing/invoices
    getBillingInvoices: builder.query<BillingInvoice[], void>({
      query: () => 'billing/invoices',
      providesTags: ['BillingInvoice'],
    }),

    // 🔹 POST /api/billing/pay/{invoiceNumber}
    payInvoice: builder.mutation<void, string>({
      query: (invoiceNumber) => ({
        url: `billing/pay/${invoiceNumber}`,
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Pembayaran berhasil');
        } catch {
          toast.error('Gagal melakukan pembayaran');
        }
      },
      invalidatesTags: ['BillingInvoice','Subscription'],
    }),
  }),
});

export const {
  useGetBillingPlansQuery,
  useGetBillingInvoicesQuery,
  usePayInvoiceMutation,
} = billingApi;
