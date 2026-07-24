import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedUser: null,
  messages: [],
  sidebarUsers: [],
  chatView: "chat",
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
      state.chatView = "chat";
    },
    setSidebarUsers: (state, action) => {
      state.sidebarUsers = action.payload;
      state.usersLoading = false;
    },

    cancelSelectedUser: (state) => {
      state.selectedUser = null;
      state.chatView = "chat";
    },
    setChatView: (state, action) => {
      state.chatView = action.payload;
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
  setChatView,
  sendNewMessage,
} = messageSlice.actions;
export default messageSlice.reducer;
