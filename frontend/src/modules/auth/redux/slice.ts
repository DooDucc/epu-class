import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AUTH_CONSTANTS, COMPONENT_STAGES } from "../../base/utils";
import { storage } from "../../base/helpers/storage";
import { AuthState, User } from "../types";

const initialState: AuthState = {
  user: null,
  authState: COMPONENT_STAGES.IDLE,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<string>) => {
      state.authState = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<User>) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    logout: (state) => {
      state.user = null;
      state.authState = COMPONENT_STAGES.IDLE;
      storage.delete(AUTH_CONSTANTS.ACCESS_TOKEN);
    },
  },
});

export const { setAuthState, setUserInfo, logout } = authSlice.actions;

export default authSlice.reducer;
