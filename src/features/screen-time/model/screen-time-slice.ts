import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScreenTimeState {
  [childId: number]: { limit: number; used: number }; 
}

const initialState: ScreenTimeState = {};

const screenTimeSlice = createSlice({
  name: 'screenTime',
  initialState,
  reducers: {
    setScreenTimeLimit(
      state,
      action: PayloadAction<{ childId: number; limit: number }>
    ) {
      state[action.payload.childId] = { limit: action.payload.limit, used: 0 };
    },
    incrementUsage(
      state,
      action: PayloadAction<{ childId: number; minutes: number }>
    ) {
      const child = state[action.payload.childId];
      if (child) child.used += action.payload.minutes;
    },
  },
});

export const { setScreenTimeLimit, incrementUsage } = screenTimeSlice.actions;
export default screenTimeSlice.reducer;
