import crypto from "crypto"
import { User } from "@prisma/client";
import { prisma } from "./prisma";

async function saltAndHashPassword(password: unknown): Promise<string> {
    if (typeof password !== "string") {
      throw new Error("Password must be a string.");
    }
  
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
  
    return `${salt}:${hash}`;
  }
  
  
async function getUserFromDb(email: unknown, pwHash: string): Promise<User | null> {
    if (typeof email !== "string") {
      throw new Error("Email must be a string.");
    }
  
    // Split the hash into salt and hashed password
    const [salt, hash] = pwHash.split(":");
  
    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { email },
    });
  
    if (!user || !user.password) {
      return null; // User not found
    }
  
    // Verify the password hash
    const inputHash = crypto
      .pbkdf2Sync(user.password, salt, 1000, 64, "sha512")
      .toString("hex");
  
    if (inputHash !== hash) {
      return null; // Password does not match
    }
  
    return user; // Return the user if email and password match
  }


export { saltAndHashPassword, getUserFromDb }
  
  