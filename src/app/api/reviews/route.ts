import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Handles GET requests to /api/reviews
// Returns all reviews for a space
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get('spaceId');

    if (!spaceId) {
        return NextResponse.json({ error: 'spaceId is required' }, { status: 400 });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: { spaceId: parseInt(spaceId) },
        });
        return NextResponse.json(reviews);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}