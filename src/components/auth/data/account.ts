import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";

export const getAccountByUserId = async (userId: string) => {
  try {
    await connectDB();
    const user = await User.findOne({ id: userId }).populate('accounts');
    return user?.accounts[0] || null;
  } catch (error) {
    console.error("Error in getAccountByUserId:", error);
    return null;
  }
};
