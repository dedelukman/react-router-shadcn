import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  username?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: 'include' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User | null, void>({
      query: () => 'users/me',
      providesTags: (result) =>
        result
          ? [{ type: 'User' as const, id: 'CURRENT' }]
          : [{ type: 'User' as const, id: 'CURRENT' }],
    }),
    login: builder.mutation<User, { email: string; password: string }>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),
    updateUser: builder.mutation<
      User,
      { id: number; body: Partial<User> | Record<string, any> }
    >({
      query: ({ id, body }) => ({ url: `users/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),
    signup: builder.mutation<
      User,
      { name: string; email: string; password: string }
    >({
      query: (body) => ({ url: 'auth/register', method: 'POST', body }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: 'auth/logout', method: 'POST' }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),
    refresh: builder.mutation<void, void>({
      query: () => ({ url: 'auth/refresh', method: 'POST' }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useUpdateUserMutation,
  useSignupMutation,
  useLogoutMutation,
  useRefreshMutation,
} = api;

export type { User };
