import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Handles GET requests to /api/reviews/check?spaceId
// Checks if a user has already reviewed a space and eventually return the review
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const spaceId = parseInt(url.searchParams.get('spaceId') || '');

        if (isNaN(spaceId)) {
            return NextResponse.json({ error: 'Invalid Space ID' }, { status: 400 });
        }
        // Check if user is authenticated
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        if (session.user.role !== 'CLIENT') {
            return NextResponse.json({ error: "User not authorized" }, { status: 403 });
        }

        // Check if the user has already reviewed the space and return the review if it exists
        const review = await prisma.review.findFirst({
            where: {
                spaceId: spaceId,
                clientId: session.user.id, // Ensure the review belongs to the authenticated user
            },
        });

        if (!review) {
            return NextResponse.json({ reviewed: false }, { status: 200 });
        }

        return NextResponse.json({ review, reviewed: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to check review' }, { status: 500 });
    }
}