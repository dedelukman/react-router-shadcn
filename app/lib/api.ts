import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Ticket,
  NotificationResponse,
  NotificationUpdateRequest,
} from './types';
import {
  getCategoryForBackend,
  getCategoryForFrontend,
  getPriorityForBackend,
  getPriorityForFrontend,
  getStatusForBackend,
  getStatusForFrontend,
} from './ticket-mapper';
import { toast } from 'sonner';

interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  username?: string;
}

interface Company {
  id?: number;
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  latitude?: number | string;
  longitude?: number | string;
  altitude?: number | string;
  avatar?: string;
}

export interface Website {
  name?: string;
  tagline?: string;
  description?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Contact
  email?: string;
  phone?: string;
  address?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/';

// Helper function untuk handle 401 errors dengan auto-refresh
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
  })(args, api, extraOptions);

  // Jika dapat 401 (Unauthorized), coba refresh token
  if (result.error && result.error.status === 401) {
    // Attempt to refresh the token
    const refreshResult = await fetchBaseQuery({
      baseUrl: API_BASE_URL,
      credentials: 'include',
    })(
      {
        url: 'auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Retry original request setelah token direfresh
      result = await fetchBaseQuery({
        baseUrl: API_BASE_URL,
        credentials: 'include',
      })(args, api, extraOptions);
    } else {
      // Refresh failed, redirect ke login
      toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      // Bisa redirect ke login page di sini jika diperlukan
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Company', 'Website', 'Ticket', 'Notification'],
  endpoints: (builder) => ({
    // User endpoints
    getCurrentUser: builder.query<User | null, void>({
      query: () => 'users/me',
      providesTags: (result) =>
        result
          ? [{ type: 'User' as const, id: 'CURRENT' }]
          : [{ type: 'User' as const, id: 'CURRENT' }],
    }),

    // Company endpoints
    getCurrentCompany: builder.query<Company | null, void>({
      query: () => 'companies/me',
      providesTags: (result) =>
        result
          ? [{ type: 'Company' as const, id: 'CURRENT' }]
          : [{ type: 'Company' as const, id: 'CURRENT' }],
    }),

    // Auth endpoints
    login: builder.mutation<User, { email: string; password: string }>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
      invalidatesTags: [
        { type: 'User', id: 'CURRENT' },
        'Ticket',
        'Company',
        'Website',
      ],
    }),

    updateUser: builder.mutation<
      User,
      { id: number; body: Partial<User> | Record<string, any> }
    >({
      query: ({ id, body }) => ({ url: `users/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    updateCompany: builder.mutation<
      Company,
      { id: number; body: Partial<Company> | Record<string, any> }
    >({
      query: ({ id, body }) => ({
        url: `companies/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Company', id: 'CURRENT' }],
    }),

    // Website endpoints
    getWebsite: builder.query<Website | null, void>({
      query: () => 'website',
      providesTags: [{ type: 'Website', id: 'SINGLE' }],
    }),

    updateWebsite: builder.mutation<
      Website,
      { body: Partial<Website> | Record<string, any> }
    >({
      query: ({ body }) => ({
        url: 'website',
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Website', id: 'SINGLE' }],
    }),

    // Ticket endpoints
    getTickets: builder.query<Ticket[], void>({
      query: () => {
        // console.log('[DEBUG] Fetching tickets from endpoint');
        return 'tickets/me';
      },
      providesTags: ['Ticket'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          if (error.status === 404) {
            toast.error(
              'Endpoint tidak ditemukan. Silakan hubungi administrator.'
            );
          } else if (error.status === 401) {
            toast.warning('Sesi Anda telah berakhir. Silakan login kembali.');
          } else if (error.status === 403) {
            toast.error('Anda tidak memiliki izin untuk mengakses data ini.');
          } else if (error.status >= 500) {
            toast.error(
              'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
            );
          } else {
            toast.error('Gagal mengambil data tiket. Silakan coba lagi.');
          }
        }
      },
      transformResponse: (response: any) => {
        // console.log('[DEBUG] Raw API Response:', response);
        // console.log(
        //   '[DEBUG] Response type:',
        //   Array.isArray(response) ? 'array' : typeof response
        // );

        // Handle jika response wrapped di property tertentu
        const ticketArray = Array.isArray(response)
          ? response
          : response?.data || response?.tickets || [];

        const transformed = ticketArray.map((ticket: any) => {
          // console.log('[DEBUG] Processing ticket:', ticket);

          const mappedTicket = {
            ...ticket,
            // Ensure required fields exist - use code as id if id doesn't exist
            id: ticket.id || ticket.code || `T-${Date.now()}`,
            category: getCategoryForFrontend(ticket.category),
            priority: getPriorityForFrontend(ticket.priority),
            status: getStatusForFrontend(ticket.status),
            // Fallback untuk dates jika tidak ada
            createdAt: ticket.createdAt || new Date().toISOString(),
            updatedAt: ticket.updatedAt || new Date().toISOString(),
          };
          // console.log('[DEBUG] Mapped ticket:', mappedTicket);
          return mappedTicket;
        });
        // console.log('[DEBUG] Transformed Response:', transformed);
        return transformed;
      },
    }),

    getTicketById: builder.query<Ticket, string>({
      query: (id) => `tickets/${id}`,
      providesTags: (result, _error, id) => [{ type: 'Ticket', id }],
      transformResponse: (response: any) => ({
        ...response,
        category: getCategoryForFrontend(response.category),
        priority: getPriorityForFrontend(response.priority),
        status: getStatusForFrontend(response.status),
      }),
    }),

    createTicket: builder.mutation<
      Ticket,
      Partial<Ticket> & { subject: string; description: string }
    >({
      query: (body) => ({
        url: 'tickets',
        method: 'POST',
        body: {
          ...body,
          category: getCategoryForBackend(body.category as string),
          priority: getPriorityForBackend(body.priority as string),
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        // Optimistic update: tambahkan ticket baru ke cache sebelum response
        const patchResult = dispatch(
          api.util.updateQueryData('getTickets', undefined, (draft) => {
            const newTicket: any = {
              id: `T-${Date.now()}`,
              code: `T-${Date.now()}`,
              subject: arg.subject,
              category: arg.category,
              priority: arg.priority,
              description: arg.description,
              status: 'Open',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            draft.push(newTicket);
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: (result) => [{ type: 'Ticket', id: 'LIST' }, 'Ticket'],
      transformResponse: (response: any) => ({
        ...response,
        category: getCategoryForFrontend(response.category),
        priority: getPriorityForFrontend(response.priority),
        status: getStatusForFrontend(response.status),
      }),
    }),

    updateTicket: builder.mutation<
      Ticket,
      { id: string; body: Partial<Ticket> }
    >({
      query: ({ id, body }) => ({
        url: `tickets/${id}`,
        method: 'PUT',
        body: {
          ...body,
          ...(body.category && {
            category: getCategoryForBackend(body.category as string),
          }),
          ...(body.priority && {
            priority: getPriorityForBackend(body.priority as string),
          }),
          ...(body.status && {
            status: getStatusForBackend(body.status as string),
          }),
        },
      }),
      async onQueryStarted(
        { id, body },
        { dispatch, queryFulfilled, getState }
      ) {
        // Optimistic update: ubah ticket di cache sebelum response
        const patchResult = dispatch(
          api.util.updateQueryData('getTickets', undefined, (draft) => {
            const index = draft.findIndex(
              (t: any) => String(t.id) === String(id)
            );
            if (index !== -1) {
              const updatedTicket: any = { ...draft[index], ...body };
              if (body.category) {
                updatedTicket.category = getCategoryForFrontend(
                  body.category as string
                );
              }
              if (body.priority) {
                updatedTicket.priority = getPriorityForFrontend(
                  body.priority as string
                );
              }
              if (body.status) {
                updatedTicket.status = getStatusForFrontend(
                  body.status as string
                );
              }
              updatedTicket.updatedAt = new Date().toISOString();
              draft[index] = updatedTicket;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, _error, { id }) => [
        { type: 'Ticket', id },
        { type: 'Ticket', id: 'LIST' },
      ],
      transformResponse: (response: any) => ({
        ...response,
        category: getCategoryForFrontend(response.category),
        priority: getPriorityForFrontend(response.priority),
        status: getStatusForFrontend(response.status),
      }),
    }),

    deleteTicket: builder.mutation<void, string>({
      query: (id) => ({
        url: `tickets/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update: hapus ticket dari cache sebelum response
        const patchResult = dispatch(
          api.util.updateQueryData('getTickets', undefined, (draft) => {
            const index = draft.findIndex(
              (t: any) => String(t.id) === String(id)
            );
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    // Notification endpoints
    getNotifications: builder.query<NotificationResponse[], void>({
      query: () => 'notifications',
      providesTags: ['Notification'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          if (error.status === 404) {
            toast.error(
              'Endpoint tidak ditemukan. Silakan hubungi administrator.'
            );
          } else if (error.status === 401) {
            toast.warning('Sesi Anda telah berakhir. Silakan login kembali.');
          } else if (error.status >= 500) {
            toast.error(
              'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
            );
          }
        }
      },
    }),

    getInboxNotifications: builder.query<NotificationResponse[], void>({
      query: () => 'notifications',
      providesTags: ['Notification'],
    }),

    getFavoriteNotifications: builder.query<NotificationResponse[], void>({
      query: () => 'notifications/favorites',
      providesTags: ['Notification'],
    }),

    getArchivedNotifications: builder.query<NotificationResponse[], void>({
      query: () => 'notifications/archived',
      providesTags: ['Notification'],
    }),

    updateNotification: builder.mutation<
      NotificationResponse,
      { id: number; body: NotificationUpdateRequest }
    >({
      query: ({ id, body }) => ({
        url: `notifications/${id}`,
        method: 'PATCH',
        body,
      }),
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          api.util.updateQueryData('getNotifications', undefined, (draft) => {
            const index = draft.findIndex((n: any) => n.id === id);
            if (index !== -1) {
              draft[index] = { ...draft[index], ...body };
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, _error, { id }) => [
        { type: 'Notification', id },
        'Notification',
      ],
    }),

    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          api.util.updateQueryData('getNotifications', undefined, (draft) => {
            const index = draft.findIndex((n: any) => n.id === id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    // Auth misc endpoints
    signup: builder.mutation<
      User,
      { name: string; email: string; password: string }
    >({
      query: (body) => ({ url: 'auth/register', method: 'POST', body }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: 'auth/logout', method: 'POST' }),
      invalidatesTags: [
        { type: 'User', id: 'CURRENT' },
        'Ticket',
        'Company',
        'Website',
      ],
    }),

    refresh: builder.mutation<void, void>({
      query: () => ({ url: 'auth/refresh', method: 'POST' }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useGetCurrentCompanyQuery,
  useUpdateCompanyMutation,
  useUpdateUserMutation,
  useSignupMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetWebsiteQuery,
  useUpdateWebsiteMutation,
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetNotificationsQuery,
  useGetInboxNotificationsQuery,
  useGetFavoriteNotificationsQuery,
  useGetArchivedNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = api;

export type { User };
