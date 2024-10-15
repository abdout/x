import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    await connectDB();
    const user = await User.findOne({ "passwordResetToken.token": token });
    return user?.passwordResetToken || null;
  } catch (error) {
    console.error("Error in getPasswordResetTokenByToken:", error);
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    await connectDB();
    const user = await User.findOne({ email });
    return user?.passwordResetToken || null;
  } catch (error) {
    console.error("Error in getPasswordResetTokenByEmail:", error);
    return null;
  }
};
