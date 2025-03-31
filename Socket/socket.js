import express from "express";
import http from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
config();
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_END_URL,
    // credentials: true,
    // methods: ["GET", "POST"],
  },
});
const userSocketMap = {}; //key:value ==> userId :socket.id
export function getSocketId(userId) {
  return userSocketMap[userId]; // receiver socket id
}
io.on("connection", (socket) => {
  console.log("A user Socket connected", socket.id);
  const userId = socket.handshake?.query.userId;
  if (userId) {
    userSocketMap[userId] = socket?.id;
  }
  //io.emits() emits broadcast event to all connected users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("User Socket disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
