import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, format, eachDayOfInterval } from "date-fns";

export async function isDateAvailable(spaceId: number, date: Date): Promise<{ available: boolean, remainingSeats: number }> {
    const space = await prisma.space.findUnique({
        where: { id: spaceId },
        select: { seats: true, isFullSpaceBooking: true }
    });

    if (!space) return { available: false, remainingSeats: 0 };

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
        where: {
            spaceId,
            bookingDate: { gte: startOfDay, lte: endOfDay }
        }
    });

    const remainingSeats = space.isFullSpaceBooking
        ? (bookings.length === 0 ? space.seats : 0)
        : (space.seats - bookings.length);

    return { available: remainingSeats > 0, remainingSeats };
}


export async function getMonthlyAvailability(spaceId: number, year: number, month: number) {
    const space = await prisma.space.findUnique({
        where: { id: spaceId },
        select: { id: true, seats: true, isFullSpaceBooking: true }
    });

    if (!space) return null;

    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(start);

    // Recupera tutte le prenotazioni del mese per quello spazio
    const bookings = await prisma.booking.findMany({
        where: {
            spaceId,
            bookingDate: {
                gte: start,
                lte: end,
            }
        },
        select: { bookingDate: true }
    });

    // Conta le prenotazioni per giorno
    const bookingsPerDay: Record<string, number> = {};
    for (const booking of bookings) {
        const dateStr = format(booking.bookingDate, "yyyy-MM-dd");
        bookingsPerDay[dateStr] = (bookingsPerDay[dateStr] || 0) + 1;
    }

    // Calcola i giorni disponibili
    const allDays = eachDayOfInterval({ start, end });
    const availableDates: string[] = [];

    for (const day of allDays) {
        const dateStr = format(day, "yyyy-MM-dd");
        const bookingsCount = bookingsPerDay[dateStr] || 0;

        const isAvailable = space.isFullSpaceBooking
            ? bookingsCount === 0
            : bookingsCount < space.seats;

        if (isAvailable) {
            availableDates.push(dateStr);
        }
    }

    return availableDates;
}