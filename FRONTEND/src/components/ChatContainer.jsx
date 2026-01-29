import React from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useSelector } from "react-redux";
import NoChatSelected from "./NoChatSelected";

function ChatContainer() {
  const { selectedUser, messagesLoading } = useSelector(
    (state) => state.message,
  );
  if (selectedUser === null) {
    return <NoChatSelected />;
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <ChatBody />

      <ChatInput />
    </div>
  );
}

export default ChatContainer;
