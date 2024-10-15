"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "../schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  await connectDB();

  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await User.findOne({ email });
  if (existingUser) return { error: "Email already in use!" };

  await User.create({ name, email, password: hashedPassword });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent!" };
};
