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

    if (session.user.role === "CLIENT") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          email: true,
          role: true,
          client: {
            select: {
              name: true,
              surname: true,
              cellphone: true,
              bookings: {
                where: {
                  bookingDate: {
                    gt: new Date(), // Only bookings after the current day
                  },
                },
                select: {
                  id: true,
                  bookingDate: true,
                  space: {
                    select: {
                      id: true,
                      name: true,
                      address: true,
                    }
                  },
                }
              },
            }
          }
        }
      });
      return NextResponse.json(user);
    } else if (session.user.role === "AGENCY") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          role: true,
          agency: {
            select: {
              userId: true,
              name: true,
              vatNumber: true,
              telephone: true,
              spaces: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                }
              },
            }
          }
        }
      });
      return NextResponse.json(user);
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