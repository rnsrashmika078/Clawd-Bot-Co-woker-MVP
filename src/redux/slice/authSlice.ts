import { User } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthType = {
  user: User | null;
};

const initState: AuthType = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthUser } = authSlice.actions;

export default authSlice.reducer;
