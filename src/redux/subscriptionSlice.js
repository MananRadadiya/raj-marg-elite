import { createSlice } from '@reduxjs/toolkit';

const stored = JSON.parse(localStorage.getItem('rajmarg_subscription') || 'null');

const PLANS = [
  {
    id: 'silver',
    name: 'Silver',
    price: 999,
    period: 'month',
    discount: 5,
    icon: '🥈',
    color: '#C0C0C0',
    features: ['5% ride discount', 'Priority support', 'No surge pricing', 'Monthly ride report'],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 1999,
    period: 'month',
    discount: 10,
    icon: '🥇',
    color: '#FFD700',
    features: ['10% ride discount', 'Priority drivers', 'Free cancellation', 'Complimentary water', 'Loyalty bonus 2x'],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 4999,
    period: 'month',
    discount: 25,
    icon: '💎',
    color: '#E5E4E2',
    features: ['25% ride discount', 'Luxury car upgrade', 'Platinum drivers only', 'Airport lounge access', 'Dedicated manager', 'Free cancellation'],
  },
];

const initialState = {
  plans: PLANS,
  activePlan: stored?.activePlan || null,
  subscribedAt: stored?.subscribedAt || null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    subscribe(state, action) {
      state.activePlan = action.payload;
      state.subscribedAt = new Date().toISOString();
      localStorage.setItem('rajmarg_subscription', JSON.stringify({
        activePlan: state.activePlan,
        subscribedAt: state.subscribedAt,
      }));
    },
    cancelSubscription(state) {
      state.activePlan = null;
      state.subscribedAt = null;
      localStorage.removeItem('rajmarg_subscription');
    },
  },
});

export const { subscribe, cancelSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
