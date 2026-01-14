import { baseApi } from './baseApi';
import type { User } from './auth.api';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User | null, void>({
      query: () => 'users/me',
      providesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    updateUser: builder.mutation<User, { id: number; body: Partial<User> }>({
      query: ({ id, body }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    uploadAvatar: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: 'users/avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),

    deleteAvatar: builder.mutation<void, void>({
      query: () => ({
        url: 'users/avatar',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'CURRENT' }],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} = userApi;
