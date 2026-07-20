import { apiSlice } from '@/apps/shared/api/apiSlice';
import type {
  CreateVendorBranchPayload,
  UpdateVendorBranchPayload,
  VendorBranch,
  VendorBranchByIdParams,
  VendorBranchListParams,
} from '@/features/vendorBranches/types';

const getVendorBranchListTag = (vendorSysId: string) => `LIST-${vendorSysId}`;

const isVendorBranchArray = (value: unknown): value is VendorBranch[] => Array.isArray(value);

const normalizeVendorBranchesResponse = (response: unknown): VendorBranch[] => {
  if (isVendorBranchArray(response)) return response;

  if (typeof response !== 'object' || response === null) return [];

  if ('content' in response && isVendorBranchArray(response.content)) {
    return response.content;
  }

  if ('data' in response && isVendorBranchArray(response.data)) {
    return response.data;
  }

  if ('data' in response) {
    return normalizeVendorBranchesResponse(response.data);
  }

  if ('branches' in response && isVendorBranchArray(response.branches)) {
    return response.branches;
  }

  return [];
};

export const vendorBranchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendorBranches: builder.query<VendorBranch[], VendorBranchListParams>({
      query: ({ vendorSysId }) => `/vendors/${vendorSysId}/branches`,
      transformResponse: normalizeVendorBranchesResponse,
      providesTags: (result, _error, { vendorSysId }) => {
        const branches = normalizeVendorBranchesResponse(result);

        return branches.length
          ? [
              ...branches.map(({ branchSysId }) => ({ type: 'VendorBranch' as const, id: branchSysId })),
              { type: 'VendorBranch', id: getVendorBranchListTag(vendorSysId) },
            ]
          : [{ type: 'VendorBranch', id: getVendorBranchListTag(vendorSysId) }];
      },
    }),
    getVendorBranchById: builder.query<VendorBranch, VendorBranchByIdParams>({
      query: ({ vendorSysId, branchSysId }) => `/vendors/${vendorSysId}/branches/${branchSysId}`,
      providesTags: (_result, _error, { branchSysId }) => [{ type: 'VendorBranch', id: branchSysId }],
    }),
    createVendorBranch: builder.mutation<
      VendorBranch,
      { vendorSysId: string; body: CreateVendorBranchPayload }
    >({
      query: ({ vendorSysId, body }) => ({
        url: `/vendors/${vendorSysId}/branches`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { vendorSysId }) => [
        { type: 'VendorBranch', id: getVendorBranchListTag(vendorSysId) },
      ],
    }),
    updateVendorBranch: builder.mutation<
      VendorBranch,
      { vendorSysId: string; branchSysId: string; body: UpdateVendorBranchPayload }
    >({
      query: ({ vendorSysId, branchSysId, body }) => ({
        url: `/vendors/${vendorSysId}/branches/${branchSysId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { vendorSysId, branchSysId }) => [
        { type: 'VendorBranch', id: branchSysId },
        { type: 'VendorBranch', id: getVendorBranchListTag(vendorSysId) },
      ],
    }),
    deleteVendorBranch: builder.mutation<void, VendorBranchByIdParams>({
      query: ({ vendorSysId, branchSysId }) => ({
        url: `/vendors/${vendorSysId}/branches/${branchSysId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { vendorSysId, branchSysId }) => [
        { type: 'VendorBranch', id: branchSysId },
        { type: 'VendorBranch', id: getVendorBranchListTag(vendorSysId) },
      ],
    }),
  }),
});

export const {
  useGetVendorBranchesQuery,
  useGetVendorBranchByIdQuery,
  useCreateVendorBranchMutation,
  useUpdateVendorBranchMutation,
  useDeleteVendorBranchMutation,
} = vendorBranchApi;
