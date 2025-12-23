import { baseApi } from './baseApi';
import type { User } from './auth.api';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User | null, void>({
      query: () => 'users/me',
      providesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    updateUser: builder.mutation<
      User,
      { id: number; body: Partial<User> }
    >({
      query: ({ id, body }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
} = userApi;
