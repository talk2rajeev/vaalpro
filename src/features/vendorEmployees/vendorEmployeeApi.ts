import { apiSlice } from '@/apps/shared/api/apiSlice';
import type {
  CreateVendorEmployeePayload,
  UpdateVendorEmployeePayload,
  VendorEmployee,
  VendorEmployeeByIdParams,
  VendorEmployeeListParams,
  VendorEmployeePage,
} from '@/features/vendorEmployees/vendorEmployeeTypes';

export const vendorEmployeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendorEmployees: builder.query<VendorEmployeePage, VendorEmployeeListParams>({
      query: ({ vendorSysId, page, size, sortBy = 'empSysId', sortDir = 'asc' }) => ({
        url: `/vendors/${vendorSysId}/employees`,
        params: { page, size, sortBy, sortDir },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ empSysId }) => ({ type: 'VendorEmployee' as const, id: empSysId })),
              { type: 'VendorEmployee', id: 'LIST' },
            ]
          : [{ type: 'VendorEmployee', id: 'LIST' }],
    }),
    getVendorEmployeeById: builder.query<VendorEmployee, VendorEmployeeByIdParams>({
      query: ({ vendorSysId, empSysId }) => `/vendors/${vendorSysId}/employees/${empSysId}`,
      providesTags: (_result, _error, { empSysId }) => [{ type: 'VendorEmployee', id: empSysId }],
    }),
    createVendorEmployee: builder.mutation<
      VendorEmployee,
      { vendorSysId: string; body: CreateVendorEmployeePayload }
    >({
      query: ({ vendorSysId, body }) => ({
        url: `/vendors/${vendorSysId}/employees`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'VendorEmployee', id: 'LIST' }],
    }),
    updateVendorEmployee: builder.mutation<
      VendorEmployee,
      { vendorSysId: string; empSysId: string; body: UpdateVendorEmployeePayload }
    >({
      query: ({ vendorSysId, empSysId, body }) => ({
        url: `/vendors/${vendorSysId}/employees/${empSysId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { empSysId }) => [
        { type: 'VendorEmployee', id: empSysId },
        { type: 'VendorEmployee', id: 'LIST' },
      ],
    }),
    // Backend currently returns 405 for DELETE, but the endpoint is kept here
    // so the UI can wire the action when the API is implemented.
    deleteVendorEmployee: builder.mutation<void, VendorEmployeeByIdParams>({
      query: ({ vendorSysId, empSysId }) => ({
        url: `/vendors/${vendorSysId}/employees/${empSysId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'VendorEmployee', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetVendorEmployeesQuery,
  useGetVendorEmployeeByIdQuery,
  useCreateVendorEmployeeMutation,
  useUpdateVendorEmployeeMutation,
  useDeleteVendorEmployeeMutation,
} = vendorEmployeeApi;
