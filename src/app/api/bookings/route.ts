import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";
import { isDateAvailable } from "@/lib/spaceAvailability";

// Handles POST request to /api/bookings
// Creates new bookings for a space for multiple dates
export async function POST(request: NextRequest) {
    try {
        // Check if the user is authenticated
        const session = await auth();
        
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const { bookingDates, spaceId, clientId } = await request.json();

        if (!Array.isArray(bookingDates) || bookingDates.length === 0) {
            return NextResponse.json({ error: "Invalid or no dates selected" }, { status: 400 });
        }

        const createdBookings = [];
        for (const bookingDate of bookingDates) {
            // Check if the booking already exists for the given date and space
            const existing = await prisma.booking.findFirst({
                where: {
                    bookingDate: {
                        gte: new Date(new Date(bookingDate).setHours(0, 0, 0, 0)),
                        lte: new Date(new Date(bookingDate).setHours(23, 59, 59, 999))
                    },
                    spaceId: spaceId,
                    clientId: clientId
                }
            });

            if (existing) {
                return NextResponse.json({ error: `Booking already exists for date ${bookingDate}` }, { status: 400 });
            }

            // Double-check availability
            const { available } = await isDateAvailable(parseInt(spaceId), new Date(bookingDate));

            if (!available) {
                return NextResponse.json({ error: `Selected date ${bookingDate} is not available` }, { status: 400 });
            }

            // Create the booking
            const booking = await prisma.booking.create({
                data: {
                    bookingDate: new Date(bookingDate),
                    spaceId: spaceId,
                    clientId: clientId
                }
            });

            // Add the created booking to the list
            createdBookings.push(booking);
        }

        return NextResponse.json({ bookings: createdBookings });
    }
    catch (error) {
        console.error("Error creating bookings:", error);
        return NextResponse.json({ error: 'Error creating bookings: ' + error }, { status: 500 });
    }
}