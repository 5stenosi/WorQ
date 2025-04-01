import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// TODO: Ottenere solo informazioni necessarie
// Handles GET requests to /api/spaces
// Returns all spaces
export async function GET() {
    try {
        const spaces = await prisma.space.findMany({
            include: { address: true, services: true, bookings: true, reviews: true }
        });
        return NextResponse.json(spaces);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
    }
}

// Handles POST requests to /api/spaces
// Creates a new space
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newSpace = await prisma.space.create({
            data: {
                name: body.name,
                agencyId: body.agencyId,
                description: body.description,
                seats: body.seats,
                numberOfSpaces: body.numberOfSpaces,
                isFullSpaceBooking: body.isFullSpaceBooking,
                typology: body.typology,
                price: body.price,
                avgRating: body.avgRating,
                address: {
                    create: body.address,
                },
                // Connect or create services
                services: {
                    connectOrCreate: body.services.map((service: { id: string, detail: string }) => ({
                        where: { id: service.id },
                        create: { detail: service.detail },
                    })),
                },
                // Images are optional
                images: body.images ? body.images : undefined,
            },
        });
        return NextResponse.json(newSpace, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create space' }, { status: 500 });
    }
}