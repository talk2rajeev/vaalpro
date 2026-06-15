import { apiSlice } from '@/apps/shared/api/apiSlice';

type LoginCredentials = {
  username: string;
  password: string;
};

type LoginResponse = {
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
  }),
});

export const { useLoginMutation } = authApi;
