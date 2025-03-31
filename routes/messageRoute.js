import express from "express";
import { authentication } from "../middleware/authentication.js";
import {
  getAllUsers,
  getUserChatHistory,
  sendMessage,
} from "../controllers/messageController.js";

const messageRoutes = express.Router();

messageRoutes.route("/users").get(authentication, getAllUsers);
messageRoutes.route("/:id").get(authentication, getUserChatHistory);
messageRoutes.route("/send/:id").post(authentication, sendMessage);

export default messageRoutes;
