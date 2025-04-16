import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Handles DELETE request to /api/bookings/[id]
// Deletes a booking by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const bookingId = parseInt(id);

        if (!bookingId) {
            throw new Error("Booking ID is required to delete a booking.");
        }

        const booking = await prisma.booking.delete({
            where: { id: bookingId }
        });

        return NextResponse.json({ message: "Booking deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting booking:", error);
        return NextResponse.json({ error: 'Error deleting booking' + error }, { status: 500 });
    }
}