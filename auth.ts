import NextAuth, { type DefaultSession } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { Adapter } from "@auth/core/adapters";
import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import User, { UserRole } from "@/lib/models/user.model";
import authConfig from "./auth.config";
import { getUserById } from "@/components/auth/data/user";
import { getTwoFactorConfirmationByUserId } from "@/components/auth/data/two-factor-confirmation";
import { getAccountByUserId } from "@/components/auth/data/account";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      const client = await clientPromise;
      const db = client.db();
      await db.collection("users").updateOne(
        { _id: new ObjectId(user.id) },
        { $set: { emailVerified: new Date() } }
      );
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (!twoFactorConfirmation) return false;

        const client = await clientPromise;
        const db = client.db();
        await db.collection("twoFactorConfirmations").deleteOne({ _id: new ObjectId(twoFactorConfirmation._id) });
      }
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role as UserRole;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
