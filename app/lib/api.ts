import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Ticket } from './types';
import {
  getCategoryForBackend,
  getCategoryForFrontend,
  getPriorityForBackend,
  getPriorityForFrontend,
  getStatusForBackend,
  getStatusForFrontend,
} from './ticket-mapper';

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

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: 'include' }),
  tagTypes: ['User', 'Company', 'Website', 'Ticket'],
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
        console.log('[DEBUG] Fetching tickets from endpoint');
        return 'tickets/me';
      },
      providesTags: ['Ticket'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          console.error('[ERROR] Failed to fetch tickets:', error);
          if (error.status === 404) {
            console.error(
              '[ERROR] Endpoint /tickets not found. Check your backend URL.'
            );
            console.error('[ERROR] Current API_BASE_URL:', API_BASE_URL);
          }
        }
      },
      transformResponse: (response: any) => {
        console.log('[DEBUG] Raw API Response:', response);
        console.log(
          '[DEBUG] Response type:',
          Array.isArray(response) ? 'array' : typeof response
        );

        // Handle jika response wrapped di property tertentu
        const ticketArray = Array.isArray(response)
          ? response
          : response?.data || response?.tickets || [];

        const transformed = ticketArray.map((ticket: any) => {
          console.log('[DEBUG] Processing ticket:', ticket);

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
          console.log('[DEBUG] Mapped ticket:', mappedTicket);
          return mappedTicket;
        });
        console.log('[DEBUG] Transformed Response:', transformed);
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
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
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
} = api;

export type { User };
