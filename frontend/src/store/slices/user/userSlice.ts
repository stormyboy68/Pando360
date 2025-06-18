import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store.ts";
import { User } from "@/types/user";
import Cookies from "js-cookie";

export interface UserState {
  isLogin: boolean;
  isSuperAdmin: boolean;
  userData: Partial<User> | null;
}

const initialState: UserState = {
  isLogin: false,
  userData: null,
  isSuperAdmin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ user: User; expiresInDays?: number }>
    ) => {
      state.isLogin = true;
      state.isSuperAdmin =
        action.payload.user?.roles?.[0]?.name === "super-admin";
      state.userData = action.payload.user;
    },
    logout: (state) => {
      state.isLogin = false;
      state.isSuperAdmin = false;
      state.userData = null;
    },
    loadUser: (
      state,
      action: PayloadAction<{ user: User; expiresInDays?: number }>
    ) => {
      state.isLogin = true;
      state.isSuperAdmin =
        action.payload.user?.roles?.[0]?.name === "super-admin";
      state.userData = action.payload.user;
    },
  },
});

export const { login, logout, loadUser } = userSlice.actions;
export const selectCount = (state: RootState) => state.user;
export default userSlice.reducer;
