import { auth } from "@/auth"
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Handles GET requests to /api/profile
// Fetch user data
export async function GET() {
  try {
    // Check if the user is authenticated
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Fetch the authenticated user's data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "CLIENT") {
      const client = await prisma.client.findUnique({
        where: { userEmail: user.email },
        include: {
          bookings: true,
        }
      });
      return NextResponse.json(client);
    } else if (user.role === "AGENCY") {
      const agency = await prisma.agency.findUnique({
        where: { userEmail: user.email },
        include: {
          spaces: true,
        }
      });
      return NextResponse.json(agency);
    } else {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}