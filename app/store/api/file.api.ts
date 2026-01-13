import { baseApi } from './baseApi';
import { toast } from 'sonner';

/* =====================
 * TYPES
 * ===================== */

export interface FileEntity {
  id: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;
  ownerType: string;
  ownerId: string;
  uploadedAt: string;
  url?: string;
}

export interface FileUploadRequest {
  file: File;
  ownerType: string;
  ownerId: string;
}

export interface FileDownloadResponse {
  blob: Blob;
  filename: string;
}

/* =====================
 * API
 * ===================== */

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 POST /api/files - Upload file
    uploadFile: builder.mutation<FileEntity, FileUploadRequest>({
      query: ({ file, ownerType, ownerId }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('ownerType', ownerType);
        formData.append('ownerId', ownerId);

        return {
          url: 'files',
          method: 'POST',
          body: formData,
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('File berhasil diunggah');
        } catch {
          toast.error('Gagal mengunggah file');
        }
      },
      invalidatesTags: ['File'],
    }),

    // 🔹 GET /api/files/owner - Get files by owner
    getFilesByOwner: builder.query<
      FileEntity[],
      { ownerType: string; ownerId: string }
    >({
      query: ({ ownerType, ownerId }) => ({
        url: 'files/owner',
        params: {
          ownerType,
          ownerId,
        },
      }),
      providesTags: ['File'],
    }),

    // 🔹 GET /api/files/{storageKey} - Download file
    downloadFile: builder.query<Blob, string>({
      query: (storageKey) => ({
        url: `files/${storageKey}`,
        responseHandler: async (response: Response) => response.blob(),
      }),
      providesTags: ['File'],
    }),

    // 🔹 GET /api/files/view/{storageKey} - View/Preview file inline
    viewFile: builder.query<Blob, string>({
      query: (storageKey) => ({
        url: `files/view/${storageKey}`,
        responseHandler: async (response: Response) => response.blob(),
      }),
      providesTags: ['File'],
    }),

    // 🔹 DELETE /api/files/{storageKey} - Delete file (if supported)
    deleteFile: builder.mutation<void, string>({
      query: (storageKey) => ({
        url: `files/${storageKey}`,
        method: 'DELETE',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('File berhasil dihapus');
        } catch {
          toast.error('Gagal menghapus file');
        }
      },
      invalidatesTags: ['File'],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useGetFilesByOwnerQuery,
  useDownloadFileQuery,
  useViewFileQuery,
  useDeleteFileMutation,
} = fileApi;
