import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { saltAndHashPassword, getUserFromDb } from "@/lib/password";
import { isUserProfileComplete } from "./lib/checkUserCompletation";
//import { PrismaClient } from "@prisma/client";

//const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        //name: { label: "Name", type: "text" },
        //telephone: { label: "Telephone", type: "text" },
        //vatNumber: { label: "VAT Number", type: "text" },
      },
      authorize: async (credentials) => {
        let user = null;

        // logic to salt and hash password
        const pwHash = saltAndHashPassword(credentials.password);

        // logic to verify if the user exists
        user = await getUserFromDb(credentials.email, await pwHash);

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.");
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    //signOut: "/logout",
    //error: "/auth/error", // Error code passed in query string as ?error=
  },
  callbacks: {
    async signIn({ user }) {
      const isComplete = await isUserProfileComplete(user.email!);
      if (!isComplete) {
        // First time signing in, redirect to complete profile
        return "/complete-profile";
      }
      return true;
    },
  },
});
