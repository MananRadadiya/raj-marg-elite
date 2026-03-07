import { createSlice } from '@reduxjs/toolkit';

const MOCK_DRIVERS = [
  {
    id: 'drv-001',
    name: 'Vikram Solanki',
    email: 'driver@rajmarg.com',
    password: '123456',
    phone: '+91 98765 43210',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    tier: 'silver',
    rating: 4.6,
    totalRatings: 213,
    ratingSum: 979.8,
    vehicle: 'Maruti Dzire — GJ 01 AB 1234',
    status: 'available',
    languages: ['Gujarati', 'Hindi', 'English'],
  },
  {
    id: 'drv-002',
    name: 'Ramesh Bhatt',
    email: 'ramesh@rajmarg.com',
    password: '123456',
    phone: '+91 98765 43211',
    photo: 'https://randomuser.me/api/portraits/men/52.jpg',
    tier: 'gold',
    rating: 4.8,
    totalRatings: 542,
    ratingSum: 2601.6,
    vehicle: 'Toyota Innova — GJ 05 CD 5678',
    status: 'available',
    languages: ['Gujarati', 'Hindi', 'English'],
  },
  {
    id: 'drv-003',
    name: 'Kiran Desai',
    email: 'kiran@rajmarg.com',
    password: '123456',
    phone: '+91 98765 43212',
    photo: 'https://randomuser.me/api/portraits/men/67.jpg',
    tier: 'platinum',
    rating: 4.9,
    totalRatings: 1204,
    ratingSum: 5899.6,
    vehicle: 'Mercedes E-Class — GJ 01 EE 9012',
    status: 'available',
    languages: ['Gujarati', 'Hindi', 'English', 'Marathi'],
  },
];

const storedDriverAuth = JSON.parse(localStorage.getItem('rajmarg_driver') || 'null');

const initialState = {
  drivers: MOCK_DRIVERS,
  currentDriver: storedDriverAuth,
  isDriverAuthenticated: !!storedDriverAuth,
  assignedBookings: JSON.parse(localStorage.getItem('rajmarg_driver_bookings') || '[]'),
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    driverLogin(state, action) {
      const { email, password } = action.payload;
      const found = state.drivers.find((d) => d.email === email && d.password === password);
      if (found) {
        const driverData = { ...found };
        delete driverData.password;
        state.currentDriver = driverData;
        state.isDriverAuthenticated = true;
        localStorage.setItem('rajmarg_driver', JSON.stringify(driverData));
      }
    },
    driverLogout(state) {
      state.currentDriver = null;
      state.isDriverAuthenticated = false;
      localStorage.removeItem('rajmarg_driver');
    },
    assignDriverToBooking(state, action) {
      const { bookingId, driverId, bookingDetails } = action.payload;
      const driver = state.drivers.find((d) => d.id === driverId);
      if (driver) {
        driver.status = 'busy';
        const assignment = {
          bookingId,
          driverId,
          driverName: driver.name,
          driverPhoto: driver.photo,
          driverPhone: driver.phone,
          driverVehicle: driver.vehicle,
          driverTier: driver.tier,
          status: 'confirmed',
          assignedAt: new Date().toISOString(),
          ...bookingDetails,
        };
        state.assignedBookings.unshift(assignment);
        localStorage.setItem('rajmarg_driver_bookings', JSON.stringify(state.assignedBookings));
      }
    },
    acceptRide(state, action) {
      const idx = state.assignedBookings.findIndex((b) => b.bookingId === action.payload);
      if (idx !== -1) {
        state.assignedBookings[idx].status = 'accepted';
        localStorage.setItem('rajmarg_driver_bookings', JSON.stringify(state.assignedBookings));
      }
    },
    rejectRide(state, action) {
      const idx = state.assignedBookings.findIndex((b) => b.bookingId === action.payload);
      if (idx !== -1) {
        state.assignedBookings[idx].status = 'rejected';
        const driver = state.drivers.find((d) => d.id === state.assignedBookings[idx].driverId);
        if (driver) driver.status = 'available';
        localStorage.setItem('rajmarg_driver_bookings', JSON.stringify(state.assignedBookings));
      }
    },
    updateRideStatus(state, action) {
      const { bookingId, status } = action.payload;
      const idx = state.assignedBookings.findIndex((b) => b.bookingId === bookingId);
      if (idx !== -1) {
        state.assignedBookings[idx].status = status;
        if (status === 'completed') {
          const driver = state.drivers.find((d) => d.id === state.assignedBookings[idx].driverId);
          if (driver) driver.status = 'available';
        }
        localStorage.setItem('rajmarg_driver_bookings', JSON.stringify(state.assignedBookings));
      }
    },
    rateDriver(state, action) {
      const { driverId, rating } = action.payload;
      const driver = state.drivers.find((d) => d.id === driverId);
      if (driver) {
        driver.ratingSum += rating;
        driver.totalRatings += 1;
        driver.rating = parseFloat((driver.ratingSum / driver.totalRatings).toFixed(1));
      }
    },
  },
});

export const {
  driverLogin,
  driverLogout,
  assignDriverToBooking,
  acceptRide,
  rejectRide,
  updateRideStatus,
  rateDriver,
} = driverSlice.actions;

export default driverSlice.reducer;
