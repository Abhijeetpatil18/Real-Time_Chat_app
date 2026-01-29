import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import {
  setSocket,
  clearSocket,
  setOnlineUsers,
} from "../feauters/socketslice.js";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const HomePage = () => {
  const { selectedUser, authUser } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (data) => {
      // update messages state
      console.log(data);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!authUser?.id) return;

    const socket = io(BASE_URL, {
      auth: { userId: authUser.id },
      transports: ["websocket"],
    });

    dispatch(setSocket(socket));

    socket.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socket.disconnect();
      dispatch(clearSocket());
    };
  }, [authUser]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <Navbar />
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            <ChatContainer />
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
