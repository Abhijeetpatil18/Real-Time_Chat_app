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
  const myId = req.user._id;
  const { receiverId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error.message);
    res.staus(500).send("Server error");
  }
};
export const forwordMessage = async (req, res) => {
  const { messageId } = req.params;
  const recipientIds = req.body.recievers || [];
  console.log(recipientIds);

  try {
    const originalMessage = await Message.findById(messageId);

    if (!originalMessage) {
      return res.status(404).json({ message: "Original message not found" });
    }

    if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one recipient is required" });
    }

    const forwardedMessages = await Promise.all(
      recipientIds.map(async (receiverId) => {
        return Message.create({
          senderId: req.user._id,
          receiverId,
          text: originalMessage.text,
          image: originalMessage.image,
        });
      }),
    );

    return res.status(201).json({
      message: "Message forwarded successfully",
      success: true,
      forwardedMessages,
      originalMessageId: messageId,
      recipientCount: forwardedMessages.length,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export const sendMessage = async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.params;
  const { text = "", image } = req.body || {};

  try {
    if (!receiverId) {
      return res.status(400).json({ message: "receiverId missing in URL" });
    }

    let imageUrl = null;

    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        resource_type: "auto",
      });
      imageUrl = uploadResult.secure_url;
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text, // now saving text as well
      image: imageUrl,
    });

    return res.status(201).json(message);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server error");
  }
};

export const deleteMessage = async (req, res) => {
  const messageId = req.params.messageId;
  // const userId = req.user._id;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // if (message.senderId.toString() !== userId.toString()) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    await Message.findByIdAndDelete(messageId);

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server error");
  }
};
