import { configureStore } from '@reduxjs/toolkit';
// import { createStore } from 'redux';

import auth from './slices/auth';

export const store = configureStore({
  reducer: {
    auth: auth,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
