import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { updateSpaceAvgRating } from '@/lib/reviewUtils';

// Handles GET requests to /api/reviews/[spaceId]
// Fetches user review for a specific space
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Convert the ID to a number
        const spaceId = parseInt(id);

        if (isNaN(spaceId)) {
            return NextResponse.json(
                { error: 'Invalid Space ID' },
                { status: 400 }
            );
        }

        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const review = await prisma.review.findFirst({
            where: { 
                spaceId: spaceId,
                clientId: session.user.id, // Ensure the review belongs to the authenticated user
            },
            select: {
                id: true,
                comment: true,
                rating: true,
            }
        });

        if (!review) {
            return NextResponse.json(
                { error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(review);
    }
    catch (error) {
        return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
    }
}

// Handles PUT requests to /api/reviews/[id]
// Updates a review
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Convert the ID to a number
        const reviewId = parseInt(params.id);

        if (isNaN(reviewId)) {
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

        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: body,
        });

        // Update the average rating of the associated space
        await updateSpaceAvgRating(updatedReview.spaceId);

        return NextResponse.json(updatedReview);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}

// Handles DELETE requests to /api/reviews/[id]
// Deletes a review
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Convert the ID to a number
        const reviewId = parseInt(params.id);

        if (isNaN(reviewId)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        const review = await prisma.review.delete({
            where: { id: reviewId },
        });

        // Update the average rating of the associated space
        await updateSpaceAvgRating(review.spaceId);

        return NextResponse.json(review);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}