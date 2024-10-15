import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    await connectDB();
    const user = await User.findOne({ id: userId });
    return user?.twoFactorConfirmation || null;
  } catch (error) {
    console.error("Error in getTwoFactorConfirmationByUserId:", error);
    return null;
  }
};
