import { apiSlice } from '@/apps/shared/api/apiSlice';
import type { UserPermission } from '@/features/auth/authSlice';

type LoginCredentials = {
  username: string;
  password: string;
};

type LoginResponse = {
  user?: string | null;
  accessToken: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    refresh: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    getUserPermissions: builder.query<UserPermission[], number>({
      query: (userId) => `/userpermissions/${userId}`,
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useGetUserPermissionsQuery } = authApi;
