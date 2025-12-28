import { baseApi } from './baseApi';
import { toast } from 'sonner';

/* =====================
 * TYPES
 * ===================== */

export interface Subscription {
  plan: string;          // BASIC / PRO / ENTERPRISE
  planName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELED';
  startDate: string;
  endDate?: string;
  trial?: boolean;
}

/* =====================
 * API
 * ===================== */

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET /api/subscription
    getCurrentSubscription: builder.query<Subscription, void>({
      query: () => 'subscription',
      providesTags: ['Subscription'],
    }),

    // 🔹 POST /api/subscription/subscribe/{planCode}
    subscribePlan: builder.mutation<void, string>({
      query: (planCode) => ({
        url: `billing/invoices/${planCode}`,
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Berhasil berlangganan');
        } catch {
          toast.error('Gagal berlangganan');
        }
      },
      invalidatesTags: ['Subscription', 'BillingInvoice'],
    }),
  }),
});

export const {
  useGetCurrentSubscriptionQuery,
  useSubscribePlanMutation,
} = subscriptionApi;
