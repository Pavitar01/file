// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/features/user/model/user-slice';
import screenTimeReducer from '@/features/screen-time/model/screen-time-slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    screenTime: screenTimeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
