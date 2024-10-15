import mongoose, { Schema, Document, Model } from "mongoose";

// Define the PasswordResetToken interface for TypeScript
export interface IPasswordResetToken extends Document {
  email: string;
  token: string;
  expires: Date;
}

// Create the schema for the PasswordResetToken model
const passwordResetTokenSchema: Schema<IPasswordResetToken> = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true }
});

// Create a unique compound index for email and token
passwordResetTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const PasswordResetToken: Model<IPasswordResetToken> = mongoose.models.PasswordResetToken || mongoose.model<IPasswordResetToken>("PasswordResetToken", passwordResetTokenSchema);
export default PasswordResetToken;
