import { createSlice } from "@reduxjs/toolkit";
const BASE_URL = "http://localhost:5000";
import { io } from "socket.io-client";

const initialState = {
  isAuthenticated: false,
  authUser: {},
  onlineUsers: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LoggingIn: (state) => {
      state.isLoggingIn = true;
      state.isLoggedOut = false;
    },
    LoggingOut: (state) => {
      state.isLoggedOut = true;
      state.isLoggingIn = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    LoginDone: (state, action) => {
      console.log("Loggin done called", state.isAuthenticated);
      state.isAuthenticated = true;
      state.authUser = action.payload;
      console.log("after loggin done ", state.isAuthenticated);
    },
    updateProfileImage: (state, action) => {
      state.authUser.profilePic = action.payload.updatedProfile;
    },
    checkAuth: (state, action) => {
      state.isAuthenticated = true;
      state.authUser = action.payload;
    },
  },
});

export const {
  LoggingIn,
  LoggingOut,
  LoginDone,
  checkAuth,
  updateProfileImage,
} = authSlice.actions;
export default authSlice.reducer;
