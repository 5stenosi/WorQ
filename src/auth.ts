import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { isUserProfileComplete } from "./lib/checkUserCompletation";
import { getUserFromDb } from "./lib/password";
import { createUserAndAccount } from "./lib/createUserAndAccount";

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
      },
      authorize: async (credentials) => {
        try {
          const email = credentials?.email as string;
          const password = credentials?.password as string;

          const user = await getUserFromDb(email, password);

          if (!user) {
            return null; // NextAuth si aspetta null per credenziali invalide
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
    //signOut: "/logout",
    //error: "/auth/error", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt", // importante per il provider Credentials
  },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;

        // Recupera il ruolo dal DB se mancante
        if (!user.role && user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          token.role = dbUser?.role || null;
        } else {
          token.role = user.role;
        }

        token.provider = account?.provider || "credentials";
        token.providerAccountId = account?.providerAccountId;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = (token.role as string) || "CLIENT"; // Imposta un valore di default se non presente
        //session.user.provider = token.provider as string;
        //session.user.providerAccountId = token.providerAccountId as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (!user?.email || !account?.provider || !account?.providerAccountId) {
        return false;
      }

      // Cerca l'utente nel database
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

      return true; // Redirect to home page if profile is complete
      // o return true ??
    },

    async redirect({ url, baseUrl }) {
      // Se l'utente è già loggato e il profilo è completo, reindirizza alla home
      if (url === "/complete-profile") {
        return baseUrl; // Redirect to home page
      }
      return baseUrl; // Default redirect to base URL
      // o return url ??
    },
  },
});
