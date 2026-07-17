import { apiSlice } from '@/apps/shared/api/apiSlice';
import type {
  Customer,
  CustomerPage,
  CustomerListParams,
  CreateCustomerPayload,
  SearchCustomersParams,
  CustomersByVendorParams,
} from '@/features/customers/customerTypes';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomerPage, CustomerListParams>({
      query: ({ page, size, sortBy = 'customerSysId', sortDir = 'asc' }) => ({
        url: '/customers',
        params: { page, size, sortBy, sortDir },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ customerSysId }) => ({ type: 'Customer' as const, id: customerSysId })),
              { type: 'Customer', id: 'LIST' },
            ]
          : [{ type: 'Customer', id: 'LIST' }],
    }),
    getCustomerById: builder.query<Customer, string>({
      query: (customerSysId) => `/customers/${customerSysId}`,
      providesTags: (_result, _error, customerSysId) => [{ type: 'Customer', id: customerSysId }],
    }),
    getCustomersByVendor: builder.query<CustomerPage, CustomersByVendorParams>({
      query: ({ vendorSysId, page, size, sortBy = 'customerSysId', sortDir = 'asc' }) => ({
        url: `/customers/by-vendor/${vendorSysId}`,
        params: { page, size, sortBy, sortDir },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ customerSysId }) => ({ type: 'Customer' as const, id: customerSysId })),
              { type: 'Customer', id: 'VENDOR_LIST' },
            ]
          : [{ type: 'Customer', id: 'VENDOR_LIST' }],
    }),
    createCustomer: builder.mutation<Customer, CreateCustomerPayload>({
      query: (body) => ({
        url: '/customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),
    updateCustomer: builder.mutation<Customer, { customerSysId: string; body: CreateCustomerPayload }>({
      query: ({ customerSysId, body }) => ({
        url: `/customers/${customerSysId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { customerSysId }) => [
        { type: 'Customer', id: customerSysId },
        { type: 'Customer', id: 'LIST' },
      ],
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (customerSysId) => ({
        url: `/customers/${customerSysId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),
    searchCustomers: builder.query<CustomerPage, SearchCustomersParams>({
      query: ({ customerLegalName, page, size }) => ({
        url: '/customers/search',
        params: { customerLegalName, page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ customerSysId }) => ({ type: 'Customer' as const, id: customerSysId })),
              { type: 'Customer', id: 'SEARCH' },
            ]
          : [{ type: 'Customer', id: 'SEARCH' }],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useGetCustomersByVendorQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useSearchCustomersQuery,
} = customerApi;
