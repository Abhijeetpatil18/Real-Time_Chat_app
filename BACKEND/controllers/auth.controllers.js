import { generateToken, protectRoute } from "../lib/utils.js";
import User from "../models/users.models.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;
    console.log(req.body);
    if (!email || !name || !password) {
      return res.status(400).send("Fill all the credentials");
    }

    if (password.length < 6) {
      return res.status(400).send("Password must minimum 6 letters");
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).send("user already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(password), salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      profilePic: profilePic,
    });
    await newUser.save();

    //generating token
    if (newUser) {
      generateToken(newUser._id, res);
    }
    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).send("Internal server error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const isMatch = bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }
    const token = generateToken(user._id, res);
    // console.log(token);
    // console.log("login success", token);

    return res.status(200).json({
      token: token,
      id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).send("Internal server error");
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.json({ message: "logout success" });
  } catch (error) {
    console.log("Error in updateprofile controller", error.message);
    res.status(500).send("Internal server error");
  }
};

export const checkRoute = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Un-authorized" });
    }

    res.status(200).json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profilePic: req.user.profilePic,
    });
  } catch (error) {
    console.log("Error in check controller", error.message);
    res.status(500).send("Internal server error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).send("Profile pic needed");
    }

    // Upload to Cloudinary using stream
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      uploadStream.end(req.file.buffer);
    });

    const updatedResponse = await uploadPromise;

    const updatedProfile = await User.findOneAndUpdate(
      { _id: userId },
      { profilePic: updatedResponse.secure_url },
      { new: true },
    );
    res.status(200).json({ updatedProfile });
  } catch (error) {
    console.log("Error in updating profile", error.message);
    res.status(500).json(error.message);
  }
};
