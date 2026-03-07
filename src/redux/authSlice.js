import { createSlice } from '@reduxjs/toolkit';

const storedUser = JSON.parse(localStorage.getItem('rajmarg_user') || 'null');

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
};

const DEMO_ACCOUNTS = [
  { email: 'demo@rajmarg.com', password: '123456', name: 'Demo Customer', role: 'customer' },
  { email: 'admin@rajmarg.com', password: 'admin123', name: 'Admin', role: 'admin' },
];

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { email, password } = action.payload;
      const found = DEMO_ACCOUNTS.find(
        (a) => a.email === email && a.password === password
      );
      if (found) {
        const user = { email: found.email, name: found.name, role: found.role };
        state.user = user;
        state.isAuthenticated = true;
        localStorage.setItem('rajmarg_user', JSON.stringify(user));
      }
    },
    otpLogin(state, action) {
      const { phone } = action.payload;
      const user = { phone, name: `User ${phone.slice(-4)}`, role: 'customer', email: '' };
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('rajmarg_user', JSON.stringify(user));
    },
    register(state, action) {
      const { email, name } = action.payload;
      const user = { email, name, role: 'customer' };
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('rajmarg_user', JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('rajmarg_user');
    },
  },
});

export const { login, otpLogin, register, logout } = authSlice.actions;
export default authSlice.reducer;
