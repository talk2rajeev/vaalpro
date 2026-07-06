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

export type ModuleResponse = {
  userId: string;
  tenantId: string;
  userType: 'PLATFORM_ADMIN' | 'ADMIN' | 'USER';
  subscribed_apps: string[];
  exp: number;
  iat: number;
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
    getModule: builder.query<ModuleResponse, void>({
      query: () => '/module',
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useGetUserPermissionsQuery, useGetModuleQuery } = authApi;
