import { createSlice } from '@reduxjs/toolkit';

const stored = JSON.parse(localStorage.getItem('rajmarg_loyalty') || 'null');

const initialState = {
  points: stored?.points || 0,
  totalEarned: stored?.totalEarned || 0,
  history: stored?.history || [],
};

function persist(state) {
  localStorage.setItem('rajmarg_loyalty', JSON.stringify({
    points: state.points,
    totalEarned: state.totalEarned,
    history: state.history,
  }));
}

const loyaltySlice = createSlice({
  name: 'loyalty',
  initialState,
  reducers: {
    earnPoints(state, action) {
      const { amount, bookingId } = action.payload;
      const earned = Math.floor(amount / 100); // ₹100 = 1 point
      state.points += earned;
      state.totalEarned += earned;
      state.history.unshift({
        type: 'earned',
        points: earned,
        bookingId,
        timestamp: new Date().toISOString(),
        description: `Earned ${earned} points for booking ${bookingId}`,
      });
      persist(state);
    },
    redeemPoints(state, action) {
      const { points, bookingId } = action.payload;
      if (points > state.points) return;
      state.points -= points;
      state.history.unshift({
        type: 'redeemed',
        points,
        bookingId,
        timestamp: new Date().toISOString(),
        description: `Redeemed ${points} points (₹${points} discount)`,
      });
      persist(state);
    },
    resetLoyalty(state) {
      state.points = 0;
      state.totalEarned = 0;
      state.history = [];
      localStorage.removeItem('rajmarg_loyalty');
    },
  },
});

export const { earnPoints, redeemPoints, resetLoyalty } = loyaltySlice.actions;
export default loyaltySlice.reducer;
