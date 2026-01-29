import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minLength: [6, "Password should contain minimum 6 characters"],
    },

    profilePic: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
