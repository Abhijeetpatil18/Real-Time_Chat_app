import express from "express";
import { Router } from "express";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/messages.controller.js";
import { protectRoute } from "../lib/utils.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/messages/:receiverId", protectRoute, getMessages);
router.post("/messages/:receiverId", protectRoute, sendMessage);

export default router;
