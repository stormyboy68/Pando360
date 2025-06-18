import { createSlice } from '@reduxjs/toolkit';

export interface ToastState {
  showToast: boolean;
  toastMessage: string;
  toastType: 'success' | 'error' | 'info' | 'warning';
}

const initialState: ToastState = {
  showToast: false,
  toastMessage: '',
  toastType: 'info',
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.showToast = true;
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type || 'info';
    },
    hideToast: (state) => {
      state.showToast = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;