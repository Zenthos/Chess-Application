import { configureStore } from '@reduxjs/toolkit';
import userReducer from './User';
import chessReducer from './Chess';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chess: chessReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
