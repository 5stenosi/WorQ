import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

async function getUserFromDb(email: string, plainPassword: string) {
  if (typeof email !== "string") {
    throw new Error("Email must be a string.");
  }

  // Trova l'utente nel DB
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Controlla che esista e che abbia una password (non social login)
  if (!user || !user.password) {
    return null;
  }

  // Confronta la password in chiaro con quella hashata
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
