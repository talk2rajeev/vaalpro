import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '@/apps/shared/api/apiSlice';

interface TodoState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  items: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.items = action.payload;
    },
  },
});

export const { setTodos } = todoSlice.actions;
export default todoSlice.reducer;
