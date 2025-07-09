import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    imageUrl: {
      //each user has an image URl
      type: String,
      required: true,
    },
    clerkId: {
      //we need the ids of users in the clerk dashboard
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true } //  createdAt, updatedAt
);

export const User = mongoose.model("User", userSchema);
