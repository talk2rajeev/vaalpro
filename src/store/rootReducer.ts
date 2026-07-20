import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '@/apps/shared/api/apiSlice';
import authReducer from '@/features/auth/authSlice';
import vendorUiReducer from '@/features/vendors/slice';
import vendorCustomerUiReducer from '@/features/vendorCustomers/slice';

export const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  vendorUi: vendorUiReducer,
  vendorCustomerUi: vendorCustomerUiReducer,
});
