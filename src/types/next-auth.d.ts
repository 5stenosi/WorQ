import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { User } from "@prisma/client";

// Extend NextAuth types to include custom user properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    email: string;
  }
}
