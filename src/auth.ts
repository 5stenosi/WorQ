import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { isUserProfileComplete } from "./lib/checkUserCompletion";
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
        token.provider = account?.provider || "credentials";
        token.providerAccountId = account?.providerAccountId;
      }

      // Sempre: aggiorna ruolo (anche dopo reload o signIn() automatico)
      // Recupera il ruolo dal DB (puoi fare anche if token.email && !token.role, ma meglio aggiornarlo sempre)
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          // include le relazioni client e agency (carica i dati correlati)
          include: { agency: true, client: true },
        });
        token.role = dbUser?.role;
        // token.clientId = dbUser?.client?.id || null;
        // token.agencyId = dbUser?.agency?.id || null;
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
          emailVerified: null, // Aggiunto per compatibilità con AdapterUser
        };
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
        //return true; // L'utente è stato creato con successo
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

      return true;
    },
  },
});
