// src/features/user/model/user-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Child {
  id: number;
  name: string;
  isBlocked: boolean;
  screenTime: number; // in minutes
}

interface UserState {
  parent: { name: string; email: string };
  children: Child[];
}

const initialState: UserState = {
  parent: { name: '', email: '' },
  children: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setParent(state, action: PayloadAction<{ name: string; email: string }>) {
      state.parent = action.payload;
    },
    addChild(state, action: PayloadAction<Child>) {
      state.children.push(action.payload);
    },
    toggleChildBlock(state, action: PayloadAction<number>) {
      const child = state.children.find((c) => c.id === action.payload);
      if (child) child.isBlocked = !child.isBlocked;
    },
  },
});

export const { setParent, addChild, toggleChildBlock } = userSlice.actions;
export default userSlice.reducer;
