import jwt from "jsonwebtoken";
import User from "../models/users.models.js";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  console.log("token generated");

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production", // set to false for development
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
  // console.log(res.cookie);
};

export const protectRoute = async (req, res, next) => {
  // console.log("Cookies received:", req.cookies);
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
  // console.log("Token:", token);
  try {
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).send("User not found");
    }
    // console.log(user);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send("Invalid or expired token");
  }
};
