import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios";
import { sendNewMessage, setMessages } from "../feauters/messageSlice";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import toast from "react-hot-toast";

function ChatBody() {
  const { messages, selectedUser } = useSelector((state) => state.message);
  const { socket } = useSelector((state) => state.socket);
  const [messagesBtwUsers, setMessagesBtwUsers] = useState([]);
  const [messagesLoading, setmessagesLoading] = useState(true);
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(
          `/messages/${selectedUser._id}`,
          {},
        );
        if (res) {
          console.log(res.data);
          setMessagesBtwUsers(res.data);
          dispatch(setMessages(res.data));
        }
      } catch (error) {
        toast.error("Failed to load messages");
      } finally {
        setmessagesLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser]);
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      // console.log("received", message);
      dispatch(sendNewMessage(message));
    };
    socket.on("sendMessageToReceiver", handleNewMessage);
    socket.on("sendMessageToSender", handleNewMessage);

    return () => {
      socket.off("sendMessageToReceiver", handleNewMessage);
      socket.off("sendMessageToSender", handleNewMessage);
    };
  }, [socket, dispatch]);
  // return <>{messages.length === 0 && <p>No messages</p>}</>;
  return messagesLoading ? (
    <MessageSkeleton />
  ) : (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <>
          {message.receiverId === selectedUser._id ? (
            <div className="chat chat-end">
              <div className="chat-bubble chat-bubble-info">{message.text}</div>
            </div>
          ) : (
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-info">{message.text}</div>
            </div>
          )}
        </>
      ))}
    </div>
  );
}

export default ChatBody;
