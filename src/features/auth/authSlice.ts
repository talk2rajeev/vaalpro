import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserPermission {
  id: number;
  userId: number;
  permissionId: number;
  permission?: {
    id: number;
    name: string;
    description?: string;
  };
}

interface AuthState {
  user: string | null;
  userId: number | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  permissions: UserPermission[];
  isPermissionsLoaded: boolean;
}

const initialState: AuthState = {
  user: null,
  userId: null,
  accessToken: null,
  isAuthenticated: false,
  isAuthChecked: false,
  permissions: [],
  isPermissionsLoaded: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: string | null; accessToken: string; userId?: number | null }>
    ) {
      const { user, accessToken, userId } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.userId = userId ?? null;
      state.isAuthenticated = true;
      state.isAuthChecked = true;
      state.isPermissionsLoaded = false;
    },
    setPermissions(state, action: PayloadAction<UserPermission[]>) {
      state.permissions = action.payload;
      state.isPermissionsLoaded = true;
    },
    logout(state) {
      state.user = null;
      state.userId = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
      state.permissions = [];
      state.isPermissionsLoaded = false;
    },
  },
});

export const { setCredentials, setPermissions, logout } = authSlice.actions;
export default authSlice.reducer;
