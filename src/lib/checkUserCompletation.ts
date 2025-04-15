import { prisma } from "./prisma";

export async function isUserProfileComplete(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    // include le relazioni client e agency (carica i dati correlati)
    include: { client: true, agency: true },
  });
  // !! converte il valore in booleano
  // user?.client verifica se esiste la relazione client (operatore optional chaining)
  // restituisce true se almeno una delle 2 relazioni esiste
  return !!user?.client || !!user?.agency;
}
