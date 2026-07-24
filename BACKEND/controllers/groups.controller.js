import Group from "../models/groups.model.js";
import User from "../models/users.models.js";

import GroupMessage from "../models/groupMessages.model.js";

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id });
    res.status(200).json({
      message: "success",
      groups: groups,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};

const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const group = new Group({ name, members: [req.user._id] });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const groupUsers = await User.find({
      _id: { $in: group.members },
    }).select("name profilePic");

    res.status(200).json({ group, members: groupUsers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const groupMessages = await GroupMessage.find({
      groupId: req.params.groupId,
    })
      .sort({ createdAt: 1 })
      .select("_id senderId text image createdAt")
      .populate("senderId", "name");

    const formatted = groupMessages.map((msg) => ({
      _id: msg._id,
      senderId: msg.senderId._id,
      senderName: msg.senderId.name,
      text: msg.text,
      image: msg.image,
      createdAt: msg.createdAt,
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};

const sendGroupMessage = async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.params.groupId", req.params.groupId);
  console.log("req.user._id", req.user._id);
  try {
    const message = new GroupMessage({
      groupId: req.params.groupId,
      senderId: req.user._id,
      text: req.body.text,
      image: req.body.image,
    });
    console.log("message", message);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error sending new message", error });
  }
};
const deleteGroupMessage = async (req, res) => {
  try {
    const message = await GroupMessage.findById(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await message.deleteOne();
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error });
  }
};

const addMemberToGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    group.members.push(req.body.memberId);
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Error adding member to group", error });
  }
};
export {
  getGroups,
  createGroup,
  getGroupById,
  addMemberToGroup,
  getGroupMessages,
  sendGroupMessage,
  deleteGroupMessage,
};
