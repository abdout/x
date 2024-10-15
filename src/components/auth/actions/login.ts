"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { LoginSchema } from "@/components/auth/schemas";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import { signIn } from "../../../../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../../../../routes";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  await connectDB();

  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { email, password, code } = validatedFields.data;

  const existingUser = await User.findOne({ email });
  if (!existingUser || !existingUser.password) return { error: "Email does not exist!" };

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled) {
    if (code) {
      const twoFactorToken = await User.findOne({ "twoFactorToken.email": email });
      if (!twoFactorToken || twoFactorToken.token !== code) return { error: "Invalid code!" };

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) return { error: "Code expired!" };

      await User.updateOne({ email }, { $unset: { twoFactorToken: "" } });
    } else {
      const newToken = await generateTwoFactorToken(email);
      await sendTwoFactorTokenEmail(newToken.email, newToken.token);
      return { twoFactor: true };
    }
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) return { error: "Invalid credentials!" };

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Something went wrong!" };
    }
    throw error;
  }
};
