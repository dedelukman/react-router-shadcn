import { baseApi } from './baseApi';

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

export const websiteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetWebsiteQuery,
  useUpdateWebsiteMutation,
} = websiteApi;
