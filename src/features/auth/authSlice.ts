import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  permissions: Array<string>
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isAuthChecked: false,
  permissions: ['vaalpro.dashboard.view', 'caaldoc.dashboard.view', 'caaldoc.plants.view'],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: string | null; accessToken: string }>) {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.isAuthChecked = true;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
