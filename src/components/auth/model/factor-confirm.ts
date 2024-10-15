import mongoose, { Schema, Document, Model } from "mongoose";

// Define the TwoFactorConfirmation interface for TypeScript
export interface ITwoFactorConfirmation extends Document {
  userId: string;
}

// Create the schema for the TwoFactorConfirmation model
const twoFactorConfirmationSchema: Schema<ITwoFactorConfirmation> = new Schema({
  userId: { type: String, required: true, unique: true }
});

const TwoFactorConfirmation: Model<ITwoFactorConfirmation> = mongoose.models.TwoFactorConfirmation || mongoose.model<ITwoFactorConfirmation>("TwoFactorConfirmation", twoFactorConfirmationSchema);
export default TwoFactorConfirmation;
