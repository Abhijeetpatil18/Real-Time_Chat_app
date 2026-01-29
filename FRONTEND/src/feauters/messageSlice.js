import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedUser: null,
  messages: [],
  sidebarUsers: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.messagesLoading = false;
    },
    //selecting user
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSidebarUsers: (state, action) => {
      state.sidebarUsers = action.payload;
      state.usersLoading = false;
    },

    cancelSelectedUser: (state) => {
      state.selectedUser = null;
    },
    sendNewMessage: (state, action) => {
      console.log("called message");
      console.log(action.payload);
      state.messages.push(action.payload);
      console.log(state.messages);
    },
  },
});

export const {
  setMessages,
  setSelectedUser,
  setSidebarUsers,
  cancelSelectedUser,
  sendNewMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
