import express from "express";
import Router from "express";
import {
  signup,
  login,
  updateProfile,
  logout,
  checkRoute,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../lib/utils.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/check", protectRoute, checkRoute);

router.post(
  "/profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile,
);

// router.post("/update-profile", protectRoute, updateProfile);

export default router;
