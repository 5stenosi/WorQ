import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { updateSpaceAvgRating } from '@/lib/reviewUtils';

// Handles GET requests to /api/reviews?spaceId
// Returns all reviews for a space
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get('spaceId');

    if (!spaceId) {
        return NextResponse.json({ error: 'spaceId is required' }, { status: 400 });
    }

    try {
        // Get all reviews for the specified space
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
        // Check if user is authenticated
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        if (session.user.role !== 'CLIENT') {
            return NextResponse.json({ error: "User not authorized" }, { status: 403 });
        }

        const body = await request.json();
        const { spaceId, clientId, rating, comment } = body;

        if (!spaceId || !clientId || !rating) {
            return NextResponse.json({ error: 'spaceId, clientId, and rating are required' }, { status: 400 });
        }

        // Create a new review
        const newReview = await prisma.review.create({
            data: {
                spaceId: parseInt(spaceId),
                clientId: clientId,
                rating: parseInt(rating),
                comment: comment || null,
            },
        });

        // Update the average rating for the space
        await updateSpaceAvgRating(newReview.spaceId);

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}