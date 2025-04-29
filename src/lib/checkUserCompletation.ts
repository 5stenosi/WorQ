import { prisma } from "./prisma";

export async function isUserProfileComplete(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      // include le relazioni client e agency (carica i dati correlati)
      include: { client: true, agency: true },
    });

    if (!user) {
      console.log("Utente non trovato per l'email:", email); // Debug
      return false; // Se l'utente non esiste, restituisci false
    }

    // !! converte il valore in booleano
    // user?.client verifica se esiste la relazione client (operatore optional chaining)
    // restituisce true se almeno una delle 2 relazioni esiste
    return !!user?.client || !!user?.agency;
  } catch (error) {
    console.error("Errore durante il recupero dell'utente:", error); // Debug
    return false; // In caso di errore, restituisci false
  }
}
