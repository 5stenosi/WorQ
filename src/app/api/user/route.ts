import { auth } from "@/auth"
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Handles GET requests to /api/user
// Fetch user data
export async function GET() {
  try {
    // const session = await auth()
    const sessionId = "773f4a64-5e44-4880-8751-8c72f021caab" // Replace with session.id
    const sessionRole = "CLIENT"; // Replace with session.role

    const user = await prisma.user.findUnique({
      where: { id: sessionId },
    })

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

  } catch (error) {
    return NextResponse.json(
      { error: "Errore del server" },
      { status: 500 }
    )
  }
}