import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => 'https://jsonplaceholder.typicode.com/todos',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Todo' as const, id })), { type: 'Todo', id: 'LIST' }]
          : [{ type: 'Todo', id: 'LIST' }],
    }),
  }),
});

export const { useGetTodosQuery } = apiSlice;
