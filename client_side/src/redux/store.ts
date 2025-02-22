import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer from './ticketsSlice';

// Create the store
export const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
