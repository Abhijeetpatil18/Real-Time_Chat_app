import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineUsers: [],
    typingUsers: [],
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter((id) => id !== action.payload);
    },
    clearSocket: (state) => {
      state.socket = null;
      state.onlineUsers = [];
      state.typingUsers = [];
    },
  },
});
export const { setSocket, setOnlineUsers, addTypingUser, removeTypingUser, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
