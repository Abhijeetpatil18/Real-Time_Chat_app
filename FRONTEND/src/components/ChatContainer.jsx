import React from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";
import NoChatSelected from "./NoChatSelected";
import GroupInfoPanel from "./GroupInfoPanel";

function ChatContainer() {
  const { selectedUser, chatView } = useSelector((state) => state.message);

  if (selectedUser === null) {
    return <NoChatSelected />;
  }

  if (selectedUser?.isGroup && chatView === "group-info") {
    return <GroupInfoPanel />;
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
