"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { NewPasswordSchema } from "../schemas";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import PasswordResetToken from "@/lib/models/password-reset";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  await connectDB();

  if (!token) return { error: "Missing token!" };

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { password } = validatedFields.data;

  const existingToken = await PasswordResetToken.findOne({ token });
  if (!existingToken) return { error: "Invalid token!" };

  if (new Date(existingToken.expires) < new Date()) return { error: "Token has expired!" };

  const existingUser = await User.findOne({ email: existingToken.email });
  if (!existingUser) return { error: "Email does not exist!" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.updateOne({ _id: existingUser._id }, { password: hashedPassword });
  await PasswordResetToken.deleteOne({ _id: existingToken._id });

  return { success: "Password updated!" };
};
