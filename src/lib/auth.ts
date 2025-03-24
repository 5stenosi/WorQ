import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Esegue l'hashing di una password con un salt.
 * @param password La password in chiaro.
 * @returns La password hashata.
 */
export async function SaltAndHashPassword(password: string) {
    const saltRounds = 10; // Livello di sicurezza dell'hashing
    const pwHash = await bcrypt.hash(password, saltRounds);
    return pwHash;
}

/**
 * Confronta una password inserita con quella hashata nel database.
 * @param password La password in chiaro inserita dall'utente.
 * @param pwHash Password hashata salvata nel database.
 * @returns True se la password è corretta, false altrimenti.
 */
export async function ComparePassword(password: string, pwHash: string): Promise<boolean> {
    return await bcrypt.compare(password, pwHash);
}

/**
 * Trova un utente nel database con email e password hashata.
 * @param email L'email dell'utente.
 * @param pwHash La password hashata.
 * @returns L'oggetto utente o null se non esiste.
 */
export async function getUserFromDB(email: string) {
    try {
        return await prisma.user.findUnique({
            where: { email }, // Cerca solo l'email
        });
    } catch (error) {
        console.error("Errore nel recupero dell'utente:", error);
        return null;
    }
}

/* vecchia versione
 
export async function getUserFromDB(email: string, pwHash: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email, password: pwHash }, // Cerca email + hash password
    });
 
    return user;
  } catch (error) {
    console.error("Errore nel recupero dell'utente:", error);
    return null;
  }
}
  */