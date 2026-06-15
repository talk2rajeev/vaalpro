import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from '@/features/auth/authSlice';
import type { RootState } from '@/store/store';

type RefreshResponse = {
  user?: string | null;
  accessToken?: string;
};

const isAuthRequest = (args: string | FetchArgs) => {
  const url = typeof args === 'string' ? args : args.url;
  return url.endsWith('/auth/login') || url.endsWith('/auth/refresh');
};

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
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
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && !isAuthRequest(args)) {
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const refreshData = refreshResult.data as RefreshResponse;

      if (refreshData.accessToken) {
        const currentUser = (api.getState() as RootState).auth.user;
        api.dispatch(
          setCredentials({
            user: refreshData.user ?? currentUser,
            accessToken: refreshData.accessToken,
          })
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
