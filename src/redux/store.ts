import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import chatFileSlice from "./slice/chatFileSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    chatFile: chatFileSlice,
  },
});

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
