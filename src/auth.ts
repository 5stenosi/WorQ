import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { isUserProfileComplete } from "./lib/checkUserCompletation";
import { getUserFromDb } from "./lib/password";
import { OAuthProvider } from "@prisma/client";
//import { OAuthProvider } from "@prisma/client";
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
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const user = await getUserFromDb(email, password);

        if (!user) {
          throw new Error("Invalid credentials.");
        }

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
    async jwt({ token, user, account }) {
      if (user?.email) {
        token.email = user.email;
      }
      // Aggiungi il provider al token se è OAuth
      if (account?.provider) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.email) {
        session.user.email = token.email;
      }
      return session;
    },
    /*
    async signIn({ user, account }) {
      if (!account || !user.email) {
        console.error("Missing account or user email.");
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        console.log("Utente non trovato per l'email:", user.email);
        await prisma.user.create({
          data: {
            email: user.email,
            oauthProvider: account.provider.toUpperCase() as OAuthProvider,
            oauthId: account.providerAccountId,
            role: "CLIENT", // default temporaneo
          },
        });
        console.log("Utente creato per la prima volta:", user.email);
        return "/complete-profile";
      }

      const isComplete = await isUserProfileComplete(user.email);
      if (!isComplete) {
        return "/complete-profile";
      }

      return true;
    },
    */
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (!user?.email || !account?.provider || !account?.providerAccountId) {
        return false;
      }

      // Cerca l'utente nel database
      let existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        // Crea il nuovo utente
        existingUser = await prisma.user.create({
          data: {
            email: user.email,
            oauthProvider: account.provider.toUpperCase() as OAuthProvider,
            oauthId: account.providerAccountId,
            role: "CLIENT", // default temporaneo
          },
        });

        // Collega anche l'account OAuth
        await prisma.account.create({
          data: {
            userId: existingUser.id,
            type: "oauth",
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            token_type: account.token_type,
            id_token: account.id_token,
            scope: account.scope,
          },
        });

        return `/complete-profile?email=${encodeURIComponent(user.email)}`;
      }

      // Se esiste ma il provider è diverso
      if (existingUser.oauthProvider !== account.provider.toUpperCase()) {
        throw new Error(
          `Account already exists with ${existingUser.oauthProvider} provider. Please sign in with that method.`
        );
      }

      const isComplete = await isUserProfileComplete(user.email);
      if (!isComplete) {
        return `/complete-profile?email=${encodeURIComponent(user.email)}`;
      }

      return "/"; // Redirect to home page if profile is complete
    },
  },
});
