import { apiSlice } from '@/apps/shared/api/apiSlice';
import type {
  Vendor,
  VendorPage,
  VendorListParams,
  CreateVendorPayload,
  SearchVendorsParams,
} from '@/features/vendors/vendorTypes';

export const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<VendorPage, VendorListParams>({
      query: ({ page, size, sortBy = 'vendorSysId', sortDir = 'asc' }) => ({
        url: '/vendors',
        params: { page, size, sortBy, sortDir },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ vendorSysId }) => ({ type: 'Vendor' as const, id: vendorSysId })),
              { type: 'Vendor', id: 'LIST' },
            ]
          : [{ type: 'Vendor', id: 'LIST' }],
    }),
    getVendorById: builder.query<Vendor, string>({
      query: (vendorSysId) => `/vendors/${vendorSysId}`,
      providesTags: (_result, _error, vendorSysId) => [{ type: 'Vendor', id: vendorSysId }],
    }),
    createVendor: builder.mutation<Vendor, CreateVendorPayload>({
      query: (body) => ({
        url: '/vendors',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Vendor', id: 'LIST' }],
    }),
    updateVendor: builder.mutation<Vendor, { vendorSysId: string; body: CreateVendorPayload }>({
      query: ({ vendorSysId, body }) => ({
        url: `/vendors/${vendorSysId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { vendorSysId }) => [
        { type: 'Vendor', id: vendorSysId },
        { type: 'Vendor', id: 'LIST' },
      ],
    }),
    deleteVendor: builder.mutation<void, string>({
      query: (vendorSysId) => ({
        url: `/vendors/${vendorSysId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Vendor', id: 'LIST' }],
    }),
    searchVendors: builder.query<VendorPage, SearchVendorsParams>({
      query: ({ vendorName, page, size }) => ({
        url: '/vendors/search',
        params: { vendorName, page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ vendorSysId }) => ({ type: 'Vendor' as const, id: vendorSysId })),
              { type: 'Vendor', id: 'SEARCH' },
            ]
          : [{ type: 'Vendor', id: 'SEARCH' }],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
  useSearchVendorsQuery,
} = vendorApi;
