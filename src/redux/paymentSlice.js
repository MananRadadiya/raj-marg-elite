import { createSlice } from '@reduxjs/toolkit';

const storedPayments = JSON.parse(localStorage.getItem('rajmarg_payments') || '[]');

const initialState = {
  payments: storedPayments,
  pendingPayment: null, // holds booking data while payment modal is open
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    /** Set booking data that needs payment */
    setPendingPayment(state, action) {
      state.pendingPayment = action.payload;
    },

    /** Clear pending (modal closed without paying) */
    clearPendingPayment(state) {
      state.pendingPayment = null;
    },

    /** Record a successful payment */
    recordPayment(state, action) {
      const payment = {
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      state.payments.unshift(payment);
      state.pendingPayment = null;
      localStorage.setItem('rajmarg_payments', JSON.stringify(state.payments));
    },

    /** Clear all payment history */
    clearPayments(state) {
      state.payments = [];
      localStorage.removeItem('rajmarg_payments');
    },
  },
});

export const {
  setPendingPayment,
  clearPendingPayment,
  recordPayment,
  clearPayments,
} = paymentSlice.actions;

export default paymentSlice.reducer;
