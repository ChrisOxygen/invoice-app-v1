import { configureStore } from "@reduxjs/toolkit";
import { invoicesSlice } from "./features/invoicesSlice";

export const store = configureStore({
  reducer: {
    invoicesData: invoicesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
