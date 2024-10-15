import mongoose, { Schema, Document, Model } from "mongoose";

// Define the TwoFactorToken interface for TypeScript
export interface ITwoFactorToken extends Document {
  email: string;
  token: string;
  expires: Date;
}

// Create the schema for the TwoFactorToken model
const twoFactorTokenSchema: Schema<ITwoFactorToken> = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  expires: { type: Date, required: true }
});

// Create a unique compound index for email and token
twoFactorTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const TwoFactorToken: Model<ITwoFactorToken> = mongoose.models.TwoFactorToken || mongoose.model<ITwoFactorToken>("TwoFactorToken", twoFactorTokenSchema);
export default TwoFactorToken;
