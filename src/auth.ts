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

        // Recupera il ruolo dal DB se mancante
        if (!user.role && user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          token.role = user.role ?? (dbUser?.role || null);
        }

        token.provider = account?.provider || "credentials";
        token.providerAccountId = account?.providerAccountId;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: (token.role as string) || "CLIENT",
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

    /*
    // Mentre signIn decide SE l'utente può accedere, redirect decide DOVE mandarlo dopo le operazioni.
    // È l'ultimo step prima che l'utente veda effettivamente una nuova pagina
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/complete-profile")) {
        return `${baseUrl}${url}`;
      }

      // Se url è una URL assoluta, assicurati che sia del tuo dominio
      if (url.startsWith(baseUrl)) {
        return url;
      }

      return baseUrl; // homepage
    },

    if (url === "/logout") {
  return `${baseUrl}/goodbye`; // Pagina personalizzata
}
    */
  },
});
