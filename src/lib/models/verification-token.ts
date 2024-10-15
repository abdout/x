import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Ensure a unique combination of email and token
verificationTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const VerificationToken = mongoose.models.VerificationToken || mongoose.model("VerificationToken", verificationTokenSchema);

export default VerificationToken;
