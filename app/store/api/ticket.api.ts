import { baseApi } from './baseApi';
import type { Ticket } from '../types';
import {
  getCategoryForBackend,
  getCategoryForFrontend,
  getPriorityForBackend,
  getPriorityForFrontend,
  getStatusForBackend,
  getStatusForFrontend,
} from '../ticket-mapper';

export const ticketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<Ticket[], void>({
      query: () => 'tickets/me',
      providesTags: ['Ticket'],
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response?.data || [];
        return list.map((t: any) => ({
          ...t,
          category: getCategoryForFrontend(t.category),
          priority: getPriorityForFrontend(t.priority),
          status: getStatusForFrontend(t.status),
        }));
      },
    }),

    createTicket: builder.mutation<Ticket, Partial<Ticket>>({
      query: (body) => ({
        url: 'tickets',
        method: 'POST',
        body: {
          ...body,
          category: getCategoryForBackend(body.category as string),
          priority: getPriorityForBackend(body.priority as string),
        },
      }),
      invalidatesTags: ['Ticket'],
    }),
  }),
});

export const { useGetTicketsQuery, useCreateTicketMutation } = ticketApi;
