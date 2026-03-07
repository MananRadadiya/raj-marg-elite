import { createSlice } from '@reduxjs/toolkit';

const storedBookings = JSON.parse(localStorage.getItem('rajmarg_bookings') || '[]');

function generateBookingId() {
  const prefix = 'RME';
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

const initialState = {
  bookings: storedBookings,
  currentBooking: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking(state, action) {
      state.currentBooking = action.payload;
    },
    confirmBooking(state, action) {
      const booking = {
        ...action.payload,
        id: generateBookingId(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      state.bookings.unshift(booking);
      state.currentBooking = null;
      localStorage.setItem('rajmarg_bookings', JSON.stringify(state.bookings));
    },
    updateBookingStatus(state, action) {
      const { id, status } = action.payload;
      const idx = state.bookings.findIndex((b) => b.id === id);
      if (idx !== -1) {
        state.bookings[idx].status = status;
        localStorage.setItem('rajmarg_bookings', JSON.stringify(state.bookings));
      }
    },
    cancelBooking(state, action) {
      const idx = state.bookings.findIndex((b) => b.id === action.payload);
      if (idx !== -1) {
        state.bookings[idx].status = 'cancelled';
        localStorage.setItem('rajmarg_bookings', JSON.stringify(state.bookings));
      }
    },
    clearBookings(state) {
      state.bookings = [];
      localStorage.removeItem('rajmarg_bookings');
    },
  },
});

export const {
  setCurrentBooking,
  confirmBooking,
  updateBookingStatus,
  cancelBooking,
  clearBookings,
} = bookingSlice.actions;
export default bookingSlice.reducer;
