import cloudinary from "../lib/cloudinary.js";
import Message from "../models/messages.model.js";
import User from "../models/users.models.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedUserId } }).select(
      "-password",
    );
    res.status(200).json({
      message: "success",
      users: users,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
};

export const getMessages = async (req, res) => {
  // console.log(req.user._id);
  // console.log(req.params.receiverId);
  const myId = req.user._id;
  const { receiverId } = req.params;
  // console.log(myId);
  // console.log(receiverId);

  try {
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
    // console.log(messages);
  } catch (error) {
    console.log(error.message);
    res.staus(500).send("Server error");
  }
};

export const sendMessage = async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.params;
  const { text } = req.body;
  try {
    if (!receiverId) {
      return res.status(400).json({ message: "receiverId missing in URL" });
    }

    const message = await Message.create({
      senderId,
      receiverId: receiverId,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error.message);
  }
};
