import { Server } from "socket.io";
import express from "express";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [`http://localhost:3000`, FRONTEND_URL],
  },
});
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.auth?.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("sendMessage", (data) => {
    const receiverSocketId = userSocketMap[data.receiverId]; //upadating socketId map

    socket.emit("sendMessageToSender", data); //even if reciever is offline, sender gets confirmation
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("sendMessageToReceiver", data); // only if receiver is online
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
