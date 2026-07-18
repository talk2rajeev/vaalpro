import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserPermission {
  conditions: Record<string, unknown>;
  display_name: string;
  permission_code: string;
  source: string;
}

interface AuthState {
  user: string | null;
  userId: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  realmRoles: string[];
  exp: number | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  permissions: UserPermission[];
  isPermissionsLoaded: boolean;
}

const initialState: AuthState = {
  user: null,
  userId: null,
  email: null,
  accessToken: null,
  refreshToken: null,
  realmRoles: [],
  exp: null,
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
      action: PayloadAction<{
        user: string | null;
        accessToken: string;
        userId?: string | null;
        email?: string | null;
        refreshToken?: string | null;
        realmRoles?: string[];
        exp?: string | number | null;
      }>
    ) {
      const { user, accessToken, userId, email, refreshToken, realmRoles, exp } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.userId = userId ?? null;
      state.email = email ?? null;
      state.refreshToken = refreshToken ?? null;
      state.realmRoles = realmRoles ?? [];
      state.exp = exp ? Number(exp) : null;
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
      state.email = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.realmRoles = [];
      state.exp = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
      state.permissions = [];
      state.isPermissionsLoaded = false;
    },
  },
});

export const { setCredentials, setPermissions, logout } = authSlice.actions;
export default authSlice.reducer;
