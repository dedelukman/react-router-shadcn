import { baseApi } from './baseApi';

interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  username?: string;
  avatarUrl?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<User, { email: string; password: string }>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'Ticket', 'Company', 'Website'],
    }),

    signup: builder.mutation<User, { name: string; email: string; password: string }>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Ticket', 'Company', 'Website'],
    }),

    refresh: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/refresh',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useRefreshMutation,
} = authApi;

export type { User };
