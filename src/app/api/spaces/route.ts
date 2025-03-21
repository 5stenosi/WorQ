import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Handles GET requests to /api/spaces
// Returns all spaces
export async function GET() {
    try {
        const spaces = await prisma.space.findMany({
            include: { address:true, services:true, bookings: true, reviews: true }
        });
        return NextResponse.json(spaces);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
    }
}