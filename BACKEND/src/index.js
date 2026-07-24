import express from "express";
import { app, server } from "../lib/socket.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import authRouter from "../routes/auth.routes.js";
import messageRouter from "../routes/message.routes.js";
import groupRouter from "../routes/group.routes.js";
import connectDB from "../lib/db.js";

dotenv.config(); // .env variables import
connectDB(() => {
  console.log("Connected to MongoDB");
}); //DB connection

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL, // Add your frontend URL here
]; // Add your allowed origins here

const corsOptions = {
  origin: allowedOrigins, // Allow only these origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  credentials: true, // If app uses cookies/sessions
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }),
);
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api", messageRouter);
app.use("/api", groupRouter);

server.listen(PORT, () => {
  console.log("server listening on PORT", PORT);
});
