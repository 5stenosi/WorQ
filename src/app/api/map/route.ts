import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Handles GET requests to the /api/map
// Returns all spaces with their coordinates
export async function GET() {
    try {
        // Fetch all spaces with their coordinates
        const spaces = await prisma.space.findMany({
            select: {
                id: true,
                name: true,
                address: {
                    select: {
                        street: true,
                        number: true,
                        city: true,
                        latitude: true,
                        longitude: true
                    }
                }
            }
        });

        // Return the spaces as JSON response
        return NextResponse.json(spaces);
    }
    catch (error) {
        // Handle any errors that occur during the fetch
        return NextResponse.json({ error: 'Failed to fetch spaces coordinates' }, { status: 500 });
    }
}