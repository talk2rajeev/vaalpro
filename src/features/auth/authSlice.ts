import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: localStorage.getItem('user'),
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: string; accessToken: string }>) {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('user', user);
      localStorage.setItem('accessToken', accessToken);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
