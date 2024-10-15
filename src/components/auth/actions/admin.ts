"use server";

import { cookies } from "next/headers";
import { UserRole } from "@/lib/models/user.model";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";

export const admin = async () => {
  await connectDB();

  const sessionToken = cookies().get("next-auth.session-token")?.value;
  if (!sessionToken) return { error: "Unauthorized" };

  const user = await User.findOne({ "sessions.sessionToken": sessionToken });
  if (!user) return { error: "Unauthorized" };

  if (user.role === UserRole.ADMIN) {
    return { success: "Allowed Server Action!" };
  }

  return { error: "Forbidden Server Action!" };
};
