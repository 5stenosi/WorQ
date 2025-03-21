import prisma from '@/lib/prisma';
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
            include: { address:true, services:true, bookings: true, reviews: true }
        });

        if (!space) {
            return NextResponse.json({ error: 'Space not found' }, { status: 404 });
        }

        return NextResponse.json(space);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}