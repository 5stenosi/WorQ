import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { updateSpaceAvgRating } from '@/lib/reviewUtils';

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

// Handles POST requests to /api/reviews
// Creates a new review
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { spaceId, clientId, rating, comment } = body;

        if (!spaceId || !clientId || !rating) {
            return NextResponse.json({ error: 'spaceId, clientId, and rating are required' }, { status: 400 });
        }

        const newReview = await prisma.review.create({
            data: {
                spaceId: parseInt(spaceId),
                clientId: parseInt(clientId),
                rating: parseInt(rating),
                comment: comment || null,
            },
        });

        await updateSpaceAvgRating(newReview.spaceId);

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}