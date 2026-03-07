import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';
import fareReducer from './fareSlice';
import paymentReducer from './paymentSlice';
import driverReducer from './driverSlice';
import notificationReducer from './notificationSlice';
import ratingReducer from './ratingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    fare: fareReducer,
    payment: paymentReducer,
    driver: driverReducer,
    notification: notificationReducer,
    rating: ratingReducer,
  },
});

export default store;
