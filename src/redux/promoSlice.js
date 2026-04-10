import { createSlice } from '@reduxjs/toolkit';
import promoCodes from '../data/promoCodes';

const initialState = {
  codes: promoCodes,
  appliedCode: null,
  discount: 0,
  error: '',
};

const promoSlice = createSlice({
  name: 'promo',
  initialState,
  reducers: {
    applyPromo(state, action) {
      const { code, fareTotal, carId } = action.payload;
      const found = state.codes.find(
        (c) => c.code.toUpperCase() === code.toUpperCase() && c.active
      );
      if (!found) {
        state.error = 'Invalid promo code';
        state.appliedCode = null;
        state.discount = 0;
        return;
      }
      if (!found.validFor.includes(carId)) {
        state.error = `This code is not valid for your selected vehicle`;
        state.appliedCode = null;
        state.discount = 0;
        return;
      }
      if (fareTotal < found.minAmount) {
        state.error = `Minimum fare of ₹${found.minAmount} required`;
        state.appliedCode = null;
        state.discount = 0;
        return;
      }
      let discount = 0;
      if (found.type === 'percent') {
        discount = Math.min(Math.round((fareTotal * found.value) / 100), found.maxDiscount);
      } else {
        discount = found.value;
      }
      state.appliedCode = found;
      state.discount = discount;
      state.error = '';
    },
    clearPromo(state) {
      state.appliedCode = null;
      state.discount = 0;
      state.error = '';
    },
  },
});

export const { applyPromo, clearPromo } = promoSlice.actions;
export default promoSlice.reducer;
