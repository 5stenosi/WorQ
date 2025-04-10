import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// Handles POST request to /api/bookings
// Creates a new booking for a space
export async function POST(request: NextRequest) {
    try {
        const { bookingDate, spaceId, clientId } = await request.json();

        const space = await prisma.space.findUnique({
            where: { id: spaceId },
            select: { id: true, seats: true, isFullSpaceBooking: true }
        });

        // TODO: Double-check availability

        const booking = await prisma.booking.create({
            data: {
                seatsBooked: 1,
                bookingDate: new Date(bookingDate),
                spaceId: spaceId,
                clientId: clientId
            }
        });

        return NextResponse.json({ booking });
    }
    catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: 'Error creating booking' + error }, { status: 500 });
    }
}