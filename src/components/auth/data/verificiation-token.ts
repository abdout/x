import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    await connectDB();
    const user = await User.findOne({ "verificationToken.token": token });
    
    if (!user || !user.verificationToken) {
      console.error("Verification token not found for token:", token);
      return null;
    }
    
    return user.verificationToken;
  } catch (error) {
    console.error("Error retrieving verification token by token:", error);
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    await connectDB();
    const user = await User.findOne({ email });
    
    if (!user || !user.verificationToken) {
      console.error("Verification token not found for email:", email);
      return null;
    }
    
    return user.verificationToken;
  } catch (error) {
    console.error("Error retrieving verification token by email:", error);
    return null;
  }
};
