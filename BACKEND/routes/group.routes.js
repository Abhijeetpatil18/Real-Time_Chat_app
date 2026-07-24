import express from "express";
import { Router } from "express";
import {
  getGroups,
  createGroup,
  getGroupById,
  addMemberToGroup,
  // //   removeMemberFromGroup,
  getGroupMessages,
  sendGroupMessage,
  deleteGroupMessage,
} from "../controllers/groups.controller.js";
import { protectRoute } from "../lib/utils.js";

const router = express.Router();

router.get("/groups", protectRoute, getGroups);

router.post("/groups", protectRoute, createGroup);

router.get("/groups/:groupId", protectRoute, getGroupById);

router.post("/groups/:groupId/members", protectRoute, addMemberToGroup);

// router.delete(
//   "/groups/:groupId/members/:memberId",
//   protectRoute,
//   removeMemberFromGroup,
// );

router.get("/groups/:groupId/messages", protectRoute, getGroupMessages);

router.post("/groups/:groupId/messages", protectRoute, sendGroupMessage);

router.delete(
  "/groups/:groupId/messages/:messageId",
  protectRoute,
  deleteGroupMessage,
);

export default router;
