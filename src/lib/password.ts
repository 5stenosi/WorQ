import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

async function getUserFromDb(email: string, plainPassword: string) {
  if (typeof email !== "string") {
    throw new Error("Email must be a string.");
  }

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Check if the user exists and has a password
  if (!user || !user.password) {
    return null;
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(plainPassword, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

export default getUserFromDb;
