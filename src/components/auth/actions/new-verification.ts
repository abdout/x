"use server";

import User from "@/lib/models/user.model";
import VerificationToken from "@/lib/models/verification-token";

export const newVerification = async (token: string) => {
  console.log("New verification initiated. Token received:", token);

  const existingToken = await VerificationToken.findOne({ token });
  if (!existingToken) {
    const existingUser = await User.findOne({ email: token });
    if (existingUser?.emailVerified) {
      return { success: "Email already verified!" };
    }
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await User.findOne({ email: existingToken.email });
  if (!existingUser) return { error: "Email does not exist!" };

  if (existingUser.emailVerified) return { success: "Email verified!" };

  existingUser.emailVerified = new Date();
  await existingUser.save();

  setTimeout(async () => {
    await VerificationToken.deleteOne({ _id: existingToken._id });
  }, 9000);

  return { success: "Email verified!" };
};
