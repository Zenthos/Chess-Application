import { createSlice } from '@reduxjs/toolkit';
import { PaletteMode } from '@mui/material';

export interface UserState {
  theme: PaletteMode;
}

const initialState: UserState = {
  theme: 'dark',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { changeTheme } = userSlice.actions;

export default userSlice.reducer;
