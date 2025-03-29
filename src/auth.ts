import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { SaltAndHashPassword } from "@/lib/auth";
import { getUserFromDB } from "@/lib/auth";
import { ZodError } from "zod";
import { signInSchema } from "./lib/zod";
import { ComparePassword } from "@/lib/auth";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma), // per salvare gli utenti nel database
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    Credentials({
      credentials: { // Funzione di autenticazione con credenziali
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null; // Se mancano email o password, ritorna null
        }

        try {
          // Valida le credenziali con Zod
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Trova l'utente nel database
          const user = await getUserFromDB(email);
          if (!user) {
            return null; // Nessun utente trovato
          }

          // Confronta la password inserita con l'hash salvato nel database
          const isValid = await ComparePassword(password, user.password);
          if (!isValid) {
            return null; // Password errata
          }

          return user; // Autenticazione riuscita
        } catch (error) {
          if (error instanceof ZodError) {
            return null; // Se la validazione fallisce, ritorna null
          }
          console.error("Errore nell'autenticazione:", error);
          return null;
        }
      }
    }),

  ],
  //secret: process.env.AUTH_SECRET, // Chiave segreta per crittografare sessioni e token (utile se si usa JWT)
  session: {
    strategy: "database", // memorizza la sessione nel database
  },
});

/* ALTERNATIVA (?)

// Define your configuration in a separate variable and pass it to NextAuth()
// This way we can also 'export const config' for use later
export const config = {
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  // ...
}
export const { signIn, signOut, handle } = NextAuth(config)
*/
