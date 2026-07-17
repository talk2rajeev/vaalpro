import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '@/apps/shared/api/apiSlice';
import authReducer from '@/features/auth/authSlice';
import vendorUiReducer from '@/features/vendors/vendorSlice';

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  vendorUi: vendorUiReducer,
});
