import { configureStore } from '@reduxjs/toolkit';
// import { createStore } from 'redux';

import auth from './slices/auth';
import posts from './slices/posts';

export const store = configureStore({
  reducer: {
    auth: auth,
    posts: posts,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
