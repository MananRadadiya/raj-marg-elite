import { createSlice } from '@reduxjs/toolkit';
import cars from '../data/cars';

const storedPrices = JSON.parse(localStorage.getItem('rajmarg_prices') || 'null');

const initialState = {
  prices: storedPrices || cars.reduce((acc, car) => {
    acc[car.id] = car.perKm;
    return acc;
  }, {}),
};

const fareSlice = createSlice({
  name: 'fare',
  initialState,
  reducers: {
    updatePrice(state, action) {
      const { carId, price } = action.payload;
      state.prices[carId] = price;
      localStorage.setItem('rajmarg_prices', JSON.stringify(state.prices));
    },
    resetPrices(state) {
      state.prices = cars.reduce((acc, car) => {
        acc[car.id] = car.perKm;
        return acc;
      }, {});
      localStorage.removeItem('rajmarg_prices');
    },
  },
});

export const { updatePrice, resetPrices } = fareSlice.actions;
export default fareSlice.reducer;
