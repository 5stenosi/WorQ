import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { updateSpaceAvgRating } from '@/lib/reviewUtils';

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