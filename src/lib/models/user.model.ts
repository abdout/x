import mongoose from "mongoose";

// Define the UserRole enum
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

const userSchema = new mongoose.Schema({
  id: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: false },
  name: { type: String, required: true },
  image: { type: String, default: null },
  bio: { type: String, default: null },
  onboarded: { type: Boolean, default: false },
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
  emailVerified: { type: Date, default: null },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  isTwoFactorEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
