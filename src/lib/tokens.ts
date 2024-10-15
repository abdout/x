import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/mongodb";
import TwoFactorToken from "@/components/auth/model/factor-token";
import PasswordResetToken from "@/components/auth/model/password";
import VerificationToken from "@/components/auth/model/verification";

// Generate a Two-Factor Authentication Token
export const generateTwoFactorToken = async (email: string) => {
  // Connect to the MongoDB database
  await connectDB();

  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes

  // Check for an existing token and delete it
  await TwoFactorToken.findOneAndDelete({ email });

  // Create and save a new token
  const newToken = new TwoFactorToken({ email, token, expires });
  await newToken.save();

  return newToken;
};

// Generate a Password Reset Token
export const generatePasswordResetToken = async (email: string) => {
  // Connect to the MongoDB database
  await connectDB();

  const token = uuidv4();
  const expires = new Date(Date.now() + 3600 * 1000); // Expires in 1 hour

  // Check for an existing token and delete it
  await PasswordResetToken.findOneAndDelete({ email });

  // Create and save a new token
  const newToken = new PasswordResetToken({ email, token, expires });
  await newToken.save();

  return newToken;
};

// Generate a Verification Token
export const generateVerificationToken = async (email: string) => {
  // Connect to the MongoDB database
  await connectDB();

  const token = uuidv4();
  const expires = new Date(Date.now() + 24 * 3600 * 1000); // Expires in 24 hours

  // Check for an existing token and delete it
  await VerificationToken.findOneAndDelete({ email });

  // Create and save a new token
  const newToken = new VerificationToken({ email, token, expires });
  await newToken.save();

  return newToken;
};
