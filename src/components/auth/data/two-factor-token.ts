import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    await connectDB();
    const user = await User.findOne({ "twoFactorToken.token": token });
    return user?.twoFactorToken || null;
  } catch (error) {
    console.error("Error in getTwoFactorTokenByToken:", error);
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    await connectDB();
    const user = await User.findOne({ email });
    return user?.twoFactorToken || null;
  } catch (error) {
    console.error("Error in getTwoFactorTokenByEmail:", error);
    return null;
  }
};
