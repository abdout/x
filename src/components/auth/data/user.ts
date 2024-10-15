import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";

export const getUserByEmail = async (email: string) => {
  try {
    await connectDB();
    return await User.findOne({ email });
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    await connectDB();
    return await User.findOne({ id });
  } catch (error) {
    console.error("Error in getUserById:", error);
    return null;
  }
};
