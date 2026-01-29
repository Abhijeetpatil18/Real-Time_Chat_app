import express from "express";
import { app, server } from "../lib/socket.js";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import authRouter from "../routes/auth.routes.js";
import messageRouter from "../routes/message.routes.js";
import connectDB from "../lib/db.js";

// const app = express();

const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: allowedOrigins, // Allow only these origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  credentials: true, // If app uses cookies/sessions
};

app.use(cors(corsOptions));

connectDB(); //DB connection

const __dirname = path.resolve();

dotenv.config(); // .env variables import

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api", messageRouter);

console.log(process.env.NODE_ENV);
console.log("directory", __dirname);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../FRONTEND/dist");

  app.use(express.static(frontendPath));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server listening on PORT", PORT);
});
