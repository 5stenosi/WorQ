import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, vatNumber, telephone, userEmail } = await req.json()

    // Controlla se l'utente esiste già
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 })
    }

    // Crea l'azienda collegata all'utente
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const agency = await prisma.agency.create({
      data: {
        name,
        vatNumber,
        telephone,
        userEmail,
      },
    })

    // Aggiorna il ruolo dell'utente a "AGENCY"
    await prisma.user.update({
      where: { email: userEmail },
      data: { role: "AGENCY" },
    })

    return NextResponse.json({ message: "Azienda registrata con successo" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Errore nella registrazione" }, { status: 500 })
  }
}
