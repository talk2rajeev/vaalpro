import { apiSlice } from '@/apps/shared/api/apiSlice';

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
  }),
});

export const { useLoginMutation, useRefreshMutation } = authApi;
