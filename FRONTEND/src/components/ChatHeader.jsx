import React from "react";
import { Phone, Video, Info, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { cancelSelectedUser } from "../feauters/messageSlice";

const ChatHeader = () => {
  const { selectedUser, sidebarUsers } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const handleRemoveChat = () => {
    dispatch(cancelSelectedUser());
  };

  // Find the selected user details from sidebarUsers
  // const user = sidebarUsers.find((u) => u._id === selectedUser);

  if (!selectedUser.name) {
    return (
      <div className="p-4 border-b border-base-300 bg-base-100">
        <div className="flex items-center justify-center h-12">
          <span className="text-zinc-500">Select a user to start chatting</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-base-300 bg-base-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedUser.profilePic || "/profile.jpg"}
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-base-300"
            />
            {onlineUsers.includes(selectedUser._id) && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-base-100"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-base-content">
              {selectedUser.name}
            </h3>
            <p className="text-sm text-zinc-500">
              {" "}
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-circle btn-ghost btn-sm hover:bg-base-200 transition-colors">
            <Phone size={18} />
          </button>
          <button className="btn btn-circle btn-ghost btn-sm hover:bg-base-200 transition-colors">
            <Video size={18} />
          </button>
          <button className="btn btn-circle btn-ghost btn-sm hover:bg-base-200 transition-colors">
            <Info size={18} />
          </button>
          <button className="btn btn-circle btn-ghost btn-sm hover:bg-base-200 transition-colors">
            <MoreVertical size={18} />
            <kbd className="kbd size-6" onClick={() => handleRemoveChat()}>
              X
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
