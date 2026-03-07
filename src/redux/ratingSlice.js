import { createSlice } from '@reduxjs/toolkit';

const storedRatings = JSON.parse(localStorage.getItem('rajmarg_ratings') || '[]');

const initialState = {
  ratings: storedRatings,
};

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    submitRating(state, action) {
      const { bookingId, driverId, driverName, rating, comment = '' } = action.payload;
      const existing = state.ratings.find((r) => r.bookingId === bookingId);
      if (!existing) {
        state.ratings.push({
          bookingId,
          driverId,
          driverName,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('rajmarg_ratings', JSON.stringify(state.ratings));
      }
    },
  },
});

export const { submitRating } = ratingSlice.actions;
export default ratingSlice.reducer;
