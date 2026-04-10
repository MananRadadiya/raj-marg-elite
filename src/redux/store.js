import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';
import fareReducer from './fareSlice';
import paymentReducer from './paymentSlice';
import driverReducer from './driverSlice';
import notificationReducer from './notificationSlice';
import ratingReducer from './ratingSlice';
import promoReducer from './promoSlice';
import loyaltyReducer from './loyaltySlice';
import profileReducer from './profileSlice';
import chatReducer from './chatSlice';
import subscriptionReducer from './subscriptionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    fare: fareReducer,
    payment: paymentReducer,
    driver: driverReducer,
    notification: notificationReducer,
    rating: ratingReducer,
    promo: promoReducer,
    loyalty: loyaltyReducer,
    profile: profileReducer,
    chat: chatReducer,
    subscription: subscriptionReducer,
  },
});

export default store;
