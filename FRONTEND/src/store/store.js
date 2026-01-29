import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feauters/authSlice.js";
import messageReducer from "../feauters/messageSlice.js";
import socketReducer from "../feauters/socketslice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
    socket: socketReducer,
  },
});

export default store;
