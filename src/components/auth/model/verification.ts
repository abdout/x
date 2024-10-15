import mongoose, { Schema, Document, Model } from "mongoose";

// Define the VerificationToken interface for TypeScript
export interface IVerificationToken extends Document {
  email: string;
  token: string;
  expires: Date;
}

// Create the schema for the VerificationToken model
const verificationTokenSchema: Schema<IVerificationToken> = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true }
});

// Create a unique compound index for email and token
verificationTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const VerificationToken: Model<IVerificationToken> = mongoose.models.VerificationToken || mongoose.model<IVerificationToken>("VerificationToken", verificationTokenSchema);
export default VerificationToken;
