import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios";
import { sendNewMessage, setMessages } from "../feauters/messageSlice";
import { addTypingUser, removeTypingUser } from "../feauters/socketslice";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import toast from "react-hot-toast";
import { Info } from "lucide-react";

function ChatBody() {
  const { messages, selectedUser } = useSelector((state) => state.message);
  const { socket, typingUsers } = useSelector((state) => state.socket);
  const [messagesBtwUsers, setMessagesBtwUsers] = useState([]);
  const [messagesLoading, setmessagesLoading] = useState(true);
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(`/messages/${selectedUser._id}`, {});
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

  useEffect(() => {
    fetchMessages();
  }, [selectedUser]);
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      dispatch(sendNewMessage(message));
    };

    const handleTyping = (data) => {
      dispatch(addTypingUser(data.senderId));
    };

    const handleStopTyping = (data) => {
      dispatch(removeTypingUser(data.senderId));
    };

    socket.on("sendMessageToReceiver", handleNewMessage);
    socket.on("sendMessageToSender", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("sendMessageToReceiver", handleNewMessage);
      socket.off("sendMessageToSender", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, dispatch]);

  async function handleDeleteMessage(id) {
    //todo
    console.log("deleted", id);
    const res = await axiosInstance.delete(`/messages/${id}`);
    if (res.status === 200) {
      toast.success("message deleted");
      fetchMessages();
    }
  }

  return messagesLoading ? (
    <MessageSkeleton />
  ) : (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isMe = message.receiverId === selectedUser._id;

        return (
          <div
            key={message._id}
            className={`flex group ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-end gap-1 ${isMe ? "" : "flex-row-reverse"}`}
            >
              {/* Dropdown */}
              <div
                className={`dropdown dropdown-bottom hidden group-hover:block ${!isMe ? "dropdown-start" : "dropdown-end"} shrink-0 mb-4`}
              >
                <div tabIndex={0} role="button" className="btn btn-xs ">
                  <Info className="size-3" />
                </div>
                <ul
                  tabIndex={-2}
                  className={`dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow`}
                >
                  <li>
                    <a onClick={() => handleDeleteMessage(message._id)}>
                      Delete
                    </a>
                  </li>
                  <li>
                    <a>Forward</a>
                  </li>
                </ul>
              </div>

              {/* Message bubble */}
              <div className={`chat ${isMe ? "chat-end" : "chat-start"} `}>
                {message.text && (
                  <div className="chat-bubble chat-bubble-info inline-block max-w-fit">
                    <p className="font-medium">{message.text}</p>
                  </div>
                )}

                {message.image && (
                  <img
                    src={message.image}
                    alt="Preview"
                    className="w-35 h-35 object-cover rounded-lg border border-zinc-700 mt-1"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}

      {typingUsers.includes(selectedUser._id) && (
        <div className="flex justify-start">
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-info inline-block max-w-fit shadow-md">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBody;
