import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/';

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
  })(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await fetchBaseQuery({
      baseUrl: API_BASE_URL,
      credentials: 'include',
    })(
      { url: 'auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      result = await fetchBaseQuery({
        baseUrl: API_BASE_URL,
        credentials: 'include',
      })(args, api, extraOptions);
    } else {
      toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Company', 'Website', 'Ticket', 'Notification','BillingPlan', 'BillingInvoice', 'Subscription'],
  endpoints: () => ({}),
});
