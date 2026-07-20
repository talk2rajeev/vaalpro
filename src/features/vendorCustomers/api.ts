import { apiSlice } from '@/apps/shared/api/apiSlice';
import type {
  CreateVendorCustomerPayload,
  SearchVendorCustomersParams,
  VendorCustomer,
  VendorCustomerListParams,
  VendorCustomerPage,
  VendorCustomersByVendorParams,
} from '@/features/vendorCustomers/types';

export const vendorCustomerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendorCustomers: builder.query<VendorCustomerPage, VendorCustomerListParams>({
      query: ({ page, size, sortBy = 'customerSysId', sortDir = 'asc' }) => ({
        url: '/customers',
        params: { page, size, sortBy, sortDir },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ customerSysId }) => ({ type: 'VendorCustomer' as const, id: customerSysId })),
              { type: 'VendorCustomer', id: 'LIST' },
            ]
          : [{ type: 'VendorCustomer', id: 'LIST' }],
    }),
    getVendorCustomerById: builder.query<VendorCustomer, string>({
      query: (customerSysId) => `/customers/${customerSysId}`,
      providesTags: (_result, _error, customerSysId) => [{ type: 'VendorCustomer', id: customerSysId }],
    }),
    getVendorCustomersByVendor: builder.query<VendorCustomerPage, VendorCustomersByVendorParams>({
      query: ({ vendorSysId, page, size, sortBy = 'customerSysId', sortDir = 'asc' }) => ({
        url: `/customers/by-vendor/${vendorSysId}`,
        params: { page, size, sortBy, sortDir },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ customerSysId }) => ({ type: 'VendorCustomer' as const, id: customerSysId })),
              { type: 'VendorCustomer', id: 'VENDOR_LIST' },
            ]
          : [{ type: 'VendorCustomer', id: 'VENDOR_LIST' }],
    }),
    createVendorCustomer: builder.mutation<VendorCustomer, CreateVendorCustomerPayload>({
      query: (body) => ({
        url: '/customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'VendorCustomer', id: 'LIST' }],
    }),
    updateVendorCustomer: builder.mutation<VendorCustomer, { customerSysId: string; body: CreateVendorCustomerPayload }>({
      query: ({ customerSysId, body }) => ({
        url: `/customers/${customerSysId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { customerSysId }) => [
        { type: 'VendorCustomer', id: customerSysId },
        { type: 'VendorCustomer', id: 'LIST' },
      ],
    }),
    deleteVendorCustomer: builder.mutation<void, string>({
      query: (customerSysId) => ({
        url: `/customers/${customerSysId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'VendorCustomer', id: 'LIST' }],
    }),
    searchVendorCustomers: builder.query<VendorCustomerPage, SearchVendorCustomersParams>({
      query: ({ customerLegalName, page, size }) => ({
        url: '/customers/search',
        params: { customerLegalName, page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ customerSysId }) => ({ type: 'VendorCustomer' as const, id: customerSysId })),
              { type: 'VendorCustomer', id: 'SEARCH' },
            ]
          : [{ type: 'VendorCustomer', id: 'SEARCH' }],
    }),
  }),
});

export const {
  useGetVendorCustomersQuery,
  useGetVendorCustomerByIdQuery,
  useGetVendorCustomersByVendorQuery,
  useCreateVendorCustomerMutation,
  useUpdateVendorCustomerMutation,
  useDeleteVendorCustomerMutation,
  useSearchVendorCustomersQuery,
} = vendorCustomerApi;
