import { apiSlice } from '@/apps/shared/api/apiSlice';
import type { UserPermission } from '@/features/auth/authSlice';

type LoginCredentials = {
  username: string;
  password: string;
};

type GenerateTokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
};

type ValidateTokenResponse = {
  active: boolean;
  exp: string;
  iat: string;
  typ: string;
  email: string;
  userId: string;
  realmRoles: string[];
};

const IAM_CLIENT_BASIC = import.meta.env.VITE_IAM_CLIENT_BASIC;

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateToken: builder.mutation<GenerateTokenResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/iam/generate-token',
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
        }),
      }),
    }),
    validateToken: builder.mutation<ValidateTokenResponse, string>({
      query: (accessToken) => ({
        url: '/iam/validate-token',
        method: 'POST',
        headers: {
          authorization: `Basic ${IAM_CLIENT_BASIC ?? ''}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ token: accessToken }),
      }),
    }),
    refresh: builder.mutation<GenerateTokenResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    getUserPermissions: builder.query<UserPermission[], string>({
      query: (userId) => `/userpermissions/${userId}`,
    }),
  }),
});

export const {
  useGenerateTokenMutation,
  useValidateTokenMutation,
  useRefreshMutation,
  useGetUserPermissionsQuery,
} = authApi;
