import { apiSlice } from '../../api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
