import { baseApi } from './baseApi';
import type {
  NotificationResponse,
  NotificationUpdateRequest,
} from '../types';
import { toast } from 'sonner';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ======================
    // GET ALL (DEFAULT / INBOX)
    // ======================
    getNotifications: builder.query<NotificationResponse[], void>({
      query: () => 'notifications',
      providesTags: ['Notification'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          if (error?.status === 404) {
            toast.error('Endpoint not found.');
          } else if (error?.status === 401) {
            toast.warning('Sesi Anda telah berakhir. Silakan login kembali.');
          } else if (error?.status >= 500) {
            toast.error('Terjadi kesalahan server.');
          }
        }
      },
    }),

    // ======================
    // INBOX
    // ======================
    getInboxNotifications: builder.query<NotificationResponse[], void>({
      query: () => 'notifications',
      providesTags: ['Notification'],
    }),

    // ======================
    // FAVORITE
    // ======================
    getFavoriteNotifications: builder.query<NotificationResponse[], void>({
      query: () => 'notifications/favorites',
      providesTags: ['Notification'],
    }),

    // ======================
    // ARCHIVED
    // ======================
    getArchivedNotifications: builder.query<NotificationResponse[], void>({
      query: () => 'notifications/archived',
      providesTags: ['Notification'],
    }),

    // ======================
    // UPDATE (READ / FAVORITE / ARCHIVE)
    // ======================
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
        /**
         * Optimistic update:
         * - langsung update cache getNotifications
         */
        const patchResult = dispatch(
          notificationApi.util.updateQueryData(
            'getNotifications',
            undefined,
            (draft) => {
              const index = draft.findIndex((n) => n.id === id);
              if (index !== -1) {
                draft[index] = { ...draft[index], ...body };
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: (result, _error, { id }) => [
        { type: 'Notification', id },
        'Notification',
      ],
    }),

    // ======================
    // DELETE
    // ======================
    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: 'DELETE',
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        /**
         * Optimistic delete:
         * - langsung hapus dari cache
         */
        const patchResult = dispatch(
          notificationApi.util.updateQueryData(
            'getNotifications',
            undefined,
            (draft) => {
              const index = draft.findIndex((n) => n.id === id);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
});


export const {
  useGetNotificationsQuery,
  useGetInboxNotificationsQuery,
  useGetFavoriteNotificationsQuery,
  useGetArchivedNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;

