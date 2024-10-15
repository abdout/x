import mongoose, { Schema, Document, Model } from "mongoose";

// Define the UserRole enum
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER"
}

// Define the User interface for TypeScript
export interface IUser extends Document {
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role: UserRole;
  accounts: string[];
  isTwoFactorEnabled: boolean;
  twoFactorConfirmation?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema for the User model
const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  emailVerified: { type: Date, default: null },
  image: { type: String, default: null },
  password: { type: String, default: null },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  accounts: [{ type: String }], // Array of Account IDs
  isTwoFactorEnabled: { type: Boolean, default: false },
  twoFactorConfirmation: { type: String, default: null }, // ID of TwoFactorConfirmation
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
