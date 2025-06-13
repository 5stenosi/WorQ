import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { updateSpaceAvgRating } from '@/lib/reviewUtils';

// Handles DELETE requests to /api/reviews/[id]
// Deletes a review
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Check if user is authenticated
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        if (session.user.role !== 'CLIENT') {
            return NextResponse.json({ error: "User not authorized" }, { status: 403 });
        }
        
        const { id } = params;

        // Convert the ID to a number
        const reviewId = parseInt(params.id);

        if (isNaN(reviewId)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        // Delete the review
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