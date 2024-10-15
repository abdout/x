"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { SettingsSchema } from "../schemas";
import { update } from "../../../../auth";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  await connectDB();

  const sessionToken = cookies().get("next-auth.session-token")?.value;
  if (!sessionToken) return { error: "Unauthorized" };

  const user = await User.findOne({ "sessions.sessionToken": sessionToken });
  if (!user) return { error: "Unauthorized" };

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await User.findOne({ email: values.email });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Verification email sent!" };
  }

  if (values.password && values.newPassword && user.password) {
    const passwordsMatch = await bcrypt.compare(values.password, user.password);
    if (!passwordsMatch) return { error: "Incorrect password!" };

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { ...values },
    { new: true }
  );

  update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    },
  });

  return { success: "Settings Updated!" };
};
