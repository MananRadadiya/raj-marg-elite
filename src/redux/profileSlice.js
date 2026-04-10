import { createSlice } from '@reduxjs/toolkit';

const stored = JSON.parse(localStorage.getItem('rajmarg_profile') || 'null');

const initialState = {
  savedAddresses: stored?.savedAddresses || [
    { id: 'home', label: 'Home', city: '' },
    { id: 'work', label: 'Work', city: '' },
  ],
  preferredCar: stored?.preferredCar || 'sedan',
  preferredTier: stored?.preferredTier || 'silver',
  language: stored?.language || 'en',
};

function persist(state) {
  localStorage.setItem('rajmarg_profile', JSON.stringify(state));
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateSavedAddress(state, action) {
      const { id, city } = action.payload;
      const addr = state.savedAddresses.find((a) => a.id === id);
      if (addr) addr.city = city;
      persist(state);
    },
    addSavedAddress(state, action) {
      state.savedAddresses.push(action.payload);
      persist(state);
    },
    removeSavedAddress(state, action) {
      state.savedAddresses = state.savedAddresses.filter((a) => a.id !== action.payload);
      persist(state);
    },
    setPreferredCar(state, action) {
      state.preferredCar = action.payload;
      persist(state);
    },
    setPreferredTier(state, action) {
      state.preferredTier = action.payload;
      persist(state);
    },
    setLanguage(state, action) {
      state.language = action.payload;
      persist(state);
    },
  },
});

export const {
  updateSavedAddress,
  addSavedAddress,
  removeSavedAddress,
  setPreferredCar,
  setPreferredTier,
  setLanguage,
} = profileSlice.actions;
export default profileSlice.reducer;
