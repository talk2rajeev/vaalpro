import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface VendorUiState {
  // Pagination & Filtering
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  searchQuery: string;

  // Dialog / Modal states
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedVendorSysId: string | null;
}

const initialState: VendorUiState = {
  page: 0,
  size: 10,
  sortBy: 'vendorSysId',
  sortDir: 'asc',
  searchQuery: '',

  isAddDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  selectedVendorSysId: null,
};

const vendorUiSlice = createSlice({
  name: 'vendorUi',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSize(state, action: PayloadAction<number>) {
      state.size = action.payload;
      state.page = 0; // reset to first page when page size changes
    },
    setSorting(state, action: PayloadAction<{ sortBy: string; sortDir: 'asc' | 'desc' }>) {
      state.sortBy = action.payload.sortBy;
      state.sortDir = action.payload.sortDir;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 0; // reset to first page when search filter updates
    },
    openAddDialog(state) {
      state.isAddDialogOpen = true;
    },
    closeAddDialog(state) {
      state.isAddDialogOpen = false;
    },
    openEditDialog(state, action: PayloadAction<string>) {
      state.selectedVendorSysId = action.payload;
      state.isEditDialogOpen = true;
    },
    closeEditDialog(state) {
      state.selectedVendorSysId = null;
      state.isEditDialogOpen = false;
    },
    openDeleteDialog(state, action: PayloadAction<string>) {
      state.selectedVendorSysId = action.payload;
      state.isDeleteDialogOpen = true;
    },
    closeDeleteDialog(state) {
      state.selectedVendorSysId = null;
      state.isDeleteDialogOpen = false;
    },
    resetFilters(state) {
      state.page = 0;
      state.searchQuery = '';
      state.sortBy = 'vendorSysId';
      state.sortDir = 'asc';
    },
  },
});

export const {
  setPage,
  setSize,
  setSorting,
  setSearchQuery,
  openAddDialog,
  closeAddDialog,
  openEditDialog,
  closeEditDialog,
  openDeleteDialog,
  closeDeleteDialog,
  resetFilters,
} = vendorUiSlice.actions;

export default vendorUiSlice.reducer;
