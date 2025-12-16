import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: 'include' }),
  tagTypes: ['User', 'Company'],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User | null, void>({
      query: () => 'users/me',
      providesTags: (result) =>
        result
          ? [{ type: 'User' as const, id: 'CURRENT' }]
          : [{ type: 'User' as const, id: 'CURRENT' }],
    }),
    getCurrentCompany: builder.query<Company | null, void>({
      query: () => 'companies/me',
      providesTags: (result) =>
        result
          ? [{ type: 'Company' as const, id: 'CURRENT' }]
          : [{ type: 'Company' as const, id: 'CURRENT' }],
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
  useGetCurrentCompanyQuery,
  useUpdateCompanyMutation,
  useUpdateUserMutation,
  useSignupMutation,
  useLogoutMutation,
  useRefreshMutation,
} = api;

export type { User };
