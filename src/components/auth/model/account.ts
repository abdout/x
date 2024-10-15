import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Account interface for TypeScript
export interface IAccount extends Document {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

// Create the schema for the Account model
const accountSchema: Schema<IAccount> = new Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  refresh_token: { type: String, default: null },
  access_token: { type: String, default: null },
  expires_at: { type: Number, default: null },
  token_type: { type: String, default: null },
  scope: { type: String, default: null },
  id_token: { type: String, default: null },
  session_state: { type: String, default: null }
});

// Create a unique compound index for provider and providerAccountId
accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const Account: Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>("Account", accountSchema);
export default Account;
