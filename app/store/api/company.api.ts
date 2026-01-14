import { baseApi } from './baseApi';

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
  logo?: string;
}

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentCompany: builder.query<Company | null, void>({
      query: () => 'companies/me',
      providesTags: [{ type: 'Company', id: 'CURRENT' }],
    }),

    updateCompany: builder.mutation<
      Company,
      { id: number; body: Partial<Company> }
    >({
      query: ({ id, body }) => ({
        url: `companies/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Company', id: 'CURRENT' }],
    }),

      uploadLogo: builder.mutation<Company, FormData>({
          query: (formData) => ({
            url: 'companies/logo',
            method: 'POST',
            body: formData,
          }),
          invalidatesTags: [{ type: 'Company', id: 'CURRENT' }],
        }),

  }),
});

export const {
  useGetCurrentCompanyQuery,
  useUpdateCompanyMutation,
  useUploadLogoMutation,
} = companyApi;
