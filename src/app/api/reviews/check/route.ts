import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Handles GET requests to /api/reviews/check?spaceId
// Checks if a user has already reviewed a space
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const spaceId = parseInt(url.searchParams.get('spaceId') || '');

        if (isNaN(spaceId)) {
            return new Response(JSON.stringify({ error: 'Invalid Space ID' }), { status: 400 });
        }

        const session = await auth();
        if (!session || !session.user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const review = await prisma.review.findFirst({
            where: {
                spaceId: spaceId,
                clientId: session.user.id, // Ensure the review belongs to the authenticated user
            },
        });

        if (!review) {
            return new Response(JSON.stringify({ reviewed: false }), { status: 200 });
        }

        return new Response(JSON.stringify({ reviewed: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to check review' }), { status: 500 });
    }
}