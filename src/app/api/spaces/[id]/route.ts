import prisma from '@/lib/prisma';
import { error } from 'console';
import { NextResponse } from 'next/server';

// Handles GET requests to /api/spaces/[id]
// Returns a single space
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        // Convert the ID to a number
        const id = parseInt(params.id);

        // Check if the ID is valid
        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        const space = await prisma.space.findUnique({
            where: { id },
            include: { address: true, services: true, bookings: true, reviews: true }
        });

        if (!space) {
            return NextResponse.json({ error: 'Space not found' }, { status: 404 });
        }

        return NextResponse.json(space);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Handles PUT requests to /api/spaces/[id]
// Updates a single space
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        const body = await request.json();

        // Body validation
        if (!body || typeof body !== 'object') {
            return NextResponse.json(
                { error: 'Request body not valid' },
                { status: 400 }
            );
        }

        const updateData: any = {
            name: body.name,
            description: body.description,
            seats: body.seats,
            numberOfSpaces: body.numberOfSpaces,
            isFullSpaceBooking: body.isFullSpaceBooking,
            typology: body.typology,
            price: parseFloat(body.price) || undefined,
            images: body.images || undefined
        };

        if (body.address) {
            updateData.address = {
                update: {
                    street: body.address.street,
                    number: body.address.number,
                    city: body.address.city,
                    zip: body.address.zip,
                    country: body.address.country,
                    latitude: parseFloat(body.address.latitude) || 0,
                    longitude: parseFloat(body.address.longitude) || 0
                }
            };
        }

        if (body.typology && !['MEETING_ROOMS', 'PRIVATE_OFFICES', 'STUDY_ROOMS', 'OUTDOOR_SPACES'].includes(body.typology)) {
            return NextResponse.json(
                { error: 'Tipologia non valida' },
                { status: 400 }
            );  
        }

        const updatedSpace = await prisma.space.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updatedSpace);
    } catch {
        return NextResponse.json({ error: 'Update failed' + error }, { status: 500 });
    }
}

// Handles DELETE requests to /api/spaces/[id]
// Deletes a single space
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        const deletedSpace = await prisma.space.delete({
            where: { id },
        });

        return NextResponse.json(deletedSpace);
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' + error }, { status: 500 });
    }
}