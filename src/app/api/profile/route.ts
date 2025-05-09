import { auth } from "@/auth"
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Handles GET requests to /api/profile
// Fetch user data
export async function GET() {
  try {
    // const session = await auth()

    // Use Prisma's findFirst method to fetch the first record if needed
    const user = await prisma.user.findFirst();

    // TODO: Check if the user is authenticated

    if (user?.role == "CLIENT") {
      const client = await prisma.client.findUnique({
        where: { userEmail: user.email },
        include: {
          bookings: {},
          user: {}
        }
      })
      return NextResponse.json(client)
    }
    else if (user?.role == "AGENCY") {
      const agency = await prisma.agency.findUnique({
        where: { userEmail: user.email },
        include: {
          spaces: {},
          user: {}
        }
      })
      return NextResponse.json(agency)
    }
    else {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 })
    }

  } catch (error) {
    return NextResponse.json(
      { error: "Errore del server" },
      { status: 500 }
    )
  }
}