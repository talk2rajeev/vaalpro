import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

type AuthStateShape = {
  auth: {
    accessToken: string | null;
  };
};

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as AuthStateShape).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // TODO: Implement refresh token logic here
    console.log('401 Unauthorized - Re-auth needed');
  }

  return result;
};
