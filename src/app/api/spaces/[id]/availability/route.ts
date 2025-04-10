import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// Handles GET requests to /api/spaces/[id]/availability?date=YYYY-MM-DD
// Returns the availability of a space
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    const space = await prisma.space.findUnique({
        where: { id: parseInt(params.id) },
        select: { id: true, seats: true, isFullSpaceBooking: true }
    });

    if (!space) {
        return NextResponse.json({ error: 'Space not found' }, { status: 404 });
    }

    const date = request.nextUrl.searchParams.get("date");
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const existingBookings = await prisma.booking.findMany({
        where: {
            spaceId: space.id,
            bookingDate: { gte: startOfDay, lte: endOfDay },
        }
    });

    const remainingSeats = space.isFullSpaceBooking ?
        (existingBookings.length === 0 ? space.seats : 0) :
        (space.seats - existingBookings.length);

    return NextResponse.json({ 
        isFullSpaceBooking: space.isFullSpaceBooking,
        available: remainingSeats > 0, 
        remainingSeats
    });
}