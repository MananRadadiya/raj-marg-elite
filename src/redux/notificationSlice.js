import { createSlice } from '@reduxjs/toolkit';

let nextId = 1;

const initialState = {
  toasts: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addToast(state, action) {
      const { message, type = 'info', duration = 4000 } = action.payload;
      state.toasts.push({
        id: nextId++,
        message,
        type,
        duration,
        createdAt: Date.now(),
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = notificationSlice.actions;
export default notificationSlice.reducer;
