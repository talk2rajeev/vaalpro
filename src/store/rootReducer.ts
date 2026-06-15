import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '@/apps/shared/api/apiSlice';
import todoReducer from '@/features/todos/todoSlice';
import authReducer from '@/features/auth/authSlice';

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  todos: todoReducer,
  auth: authReducer,
});
