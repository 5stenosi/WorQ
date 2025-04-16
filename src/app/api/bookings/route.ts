import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { isDateAvailable } from "@/lib/spaceAvailability";

// Handles POST request to /api/bookings
// Creates a new booking for a space
export async function POST(request: NextRequest) {
    try {
        const { bookingDate, spaceId, clientId } = await request.json();

        // Double-check availability
        const { available } = await isDateAvailable(parseInt(spaceId), bookingDate);

        if (!available) {
            return NextResponse.json({ error: "Selected date is not available" }, { status: 400 });
        }

        // Check if the booking already exists for the given date and space
        const existing = await prisma.booking.findFirst({
            where: {
                bookingDate: {
                    gte: new Date(bookingDate.setHours(0,0,0,0)),
                    lte: new Date(bookingDate.setHours(23,59,59,999))
                },
                spaceId: spaceId,
                clientId: clientId
            }
        });
        
        if (existing) {
            return NextResponse.json({ error: "Booking already exists for this date" }, { status: 400 });
        }

        // Create the booking
        const booking = await prisma.booking.create({
            data: {
                bookingDate: new Date(bookingDate),
                spaceId: spaceId,
                clientId: clientId
            }
        });

        return NextResponse.json({ booking });
    }
    catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: 'Error creating booking' }, { status: 500 });
    }
}