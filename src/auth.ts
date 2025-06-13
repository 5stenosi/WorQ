import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import getUserFromDb from "./lib/password";
import { createUserAndAccount } from "./lib/createUserAndAccount";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // The authorize function handles the custom login logic and determines whether the credentials provided are valid.
      // It receives the input values defined in credentials, and you must return either a user object or null.
      // If null is returned, the login fails.
      authorize: async (credentials) => {
        try {
          const email = credentials?.email as string;
          const password = credentials?.password as string;

          const user = await getUserFromDb(email, password);

          if (!user) {
            return null; // no user found
          }

          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account }) {
      // First time login
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email ?? token.email ?? "";
        token.provider = account?.provider || "credentials";
        token.providerAccountId = account?.providerAccountId;
      }

      // Always update the token with the user's role
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          // Include agency and client relations (loads related data)
          include: { agency: true, client: true },
        });
        token.role = dbUser?.role ?? "defaultRole";
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
          emailVerified: null, // Added for compatibility with AdapterUser
        };
      }
      return session;
    },

    async signIn({ user, account }) {
      // If the user is signing in with credentials, we allow it without further checks
      if (account?.provider === "credentials") {
        return true;
      }

      if (!user?.email || !account?.provider || !account?.providerAccountId) {
        return false;
      }

      // Check if the user already exists in the database
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        await createUserAndAccount({
          email: user.email,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        });
        return `/complete-profile?email=${encodeURIComponent(user.email)}`;
      }

      return true;
    },
  },
});
