import express from "express";
import { Router } from "express";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  deleteMessage,
  forwordMessage,
} from "../controllers/messages.controller.js";
import { protectRoute } from "../lib/utils.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/messages/:receiverId", protectRoute, getMessages);
router.post("/messages/:receiverId", protectRoute, sendMessage);
router.delete("/messages/:messageId", protectRoute, deleteMessage);
router.post("/messages/:messageId/forward", protectRoute, forwordMessage);

export default router;
