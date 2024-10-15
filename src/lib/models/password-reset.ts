// models/PasswordResetToken.ts
import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Ensure a unique combination of email and token
passwordResetTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const PasswordResetToken = mongoose.models.PasswordResetToken || mongoose.model("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetToken;
