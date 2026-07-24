import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios";
import { sendNewMessage, setMessages } from "../feauters/messageSlice";
import { addTypingUser, removeTypingUser } from "../feauters/socketslice";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import { deleteGroupMessageRequest } from "../lib/groupApi";
import ForwardMessageModal from "./ForwardMessageModal";

function ChatBody() {
  const dispatch = useDispatch();

  const { messages, selectedUser } = useSelector((state) => state.message);
  const { socket, typingUsers } = useSelector((state) => state.socket);
  const { authUser } = useSelector((state) => state.auth);

  const [messagesLoading, setMessagesLoading] = useState(true);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [forwardMessageId, setForwardMessageId] = useState(null);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [forwardUsers, setForwardUsers] = useState([]);

  const fetchMessages = async () => {
    if (!selectedUser) return;
    console.log(selectedUser);

    setMessagesLoading(true);

    try {
      const endpoint = selectedUser.isGroup
        ? `/groups/${selectedUser._id}/messages`
        : `/messages/${selectedUser._id}`;

      const res = await axiosInstance.get(endpoint);
      console.log(res.data);

      dispatch(setMessages(res.data));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    const loadForwardUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        const users = res?.data?.users || [];
        setForwardUsers(users.filter((user) => user._id !== authUser?.id));
      } catch (error) {
        console.error("Failed to load users for forwarding", error);
      }
    };

    loadForwardUsers();
  }, [authUser?.id]);

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

    // Group messages (if emitted from backend)
    socket.on("newGroupMessage", handleNewMessage);

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("sendMessageToReceiver", handleNewMessage);
      socket.off("sendMessageToSender", handleNewMessage);
      socket.off("newGroupMessage", handleNewMessage);

      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, dispatch]);

  const handleDeleteMessage = async (id) => {
    try {
      const res = selectedUser?.isGroup
        ? await deleteGroupMessageRequest(selectedUser._id, id)
        : await axiosInstance.delete(`/messages/${id}`);

      if (res.status === 200) {
        toast.success("Message deleted");
        fetchMessages();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete message");
    }
  };

  const openForwardModal = (messageId) => {
    setForwardMessageId(messageId);
    setSelectedRecipients([]);
    setIsForwardModalOpen(true);
  };

  const toggleRecipient = (recipientId) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId],
    );
  };

  const handleForwardConfirm = async () => {
    if (!forwardMessageId || selectedRecipients.length === 0) return;
    const recievers = selectedRecipients;
    const res = await axiosInstance.post(
      `/messages/${forwardMessageId}/forward`,
      {
        recievers: recievers,
      },
    );
    console.log(res);
    if (res.data.success) {
      toast.success("Message forwarded");
    } else {
      toast.danger("Message forwarded");
    }
    setIsForwardModalOpen(false);
    setSelectedRecipients([]);
    setForwardMessageId(null);
  };

  if (messagesLoading) return <MessageSkeleton />;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const senderId = message.senderId;

        const isMe = senderId === authUser.id;

        return (
          <div
            key={message._id}
            className={`flex group ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-end gap-2 ${
                isMe ? "" : "flex-row-reverse"
              }`}
            >
              {/* Dropdown */}
              <div
                className={`dropdown dropdown-bottom hidden group-hover:block ${
                  isMe ? "dropdown-end" : "dropdown-start"
                } mb-4`}
              >
                <div tabIndex={0} role="button" className="btn btn-xs">
                  <Info className="size-3" />
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow"
                >
                  <li>
                    <a onClick={() => handleDeleteMessage(message._id)}>
                      Delete
                    </a>
                  </li>

                  <li>
                    <a onClick={() => openForwardModal(message._id)}>Forward</a>
                  </li>
                </ul>
              </div>

              {/* Chat */}
              <div className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                {/* Sender name for groups */}
                {selectedUser?.isGroup && !isMe && (
                  <div className="text-xs text-primary font-semibold mb-1 ml-2">
                    {message.senderName}
                  </div>
                )}

                {/* Image */}
                {message.image && (
                  <img
                    src={message.image}
                    alt="Preview"
                    className="w-40 rounded-lg border border-zinc-700 mb-2"
                  />
                )}

                {/* Text */}
                {message.text && (
                  <div className="chat-bubble chat-bubble-info">
                    {message.text}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {!selectedUser?.isGroup && typingUsers.includes(selectedUser?._id) && (
        <div className="flex justify-start">
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-info">
              <span className="loading loading-dots loading-sm"></span>
            </div>
          </div>
        </div>
      )}

      <ForwardMessageModal
        isOpen={isForwardModalOpen}
        onClose={() => setIsForwardModalOpen(false)}
        users={forwardUsers}
        selectedRecipients={selectedRecipients}
        onToggleRecipient={toggleRecipient}
        onConfirm={handleForwardConfirm}
      />
    </div>
  );
}

export default ChatBody;
