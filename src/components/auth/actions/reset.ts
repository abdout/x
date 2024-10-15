"use server";

import * as z from "zod";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "../schemas";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  await connectDB();

  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid email!" };

  const { email } = validatedFields.data;

  const existingUser = await User.findOne({ email });
  if (!existingUser) return { error: "Email not found!" };

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: "Reset email sent!" };
};
