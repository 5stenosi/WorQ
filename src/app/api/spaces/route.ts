import { prisma } from '@/lib/prisma';
import { set } from 'date-fns';
import { NextResponse, NextRequest } from 'next/server';

// Handles GET requests to /api/spaces
// Returns all spaces
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Extract query parameters
        const typology = searchParams.get('typology');
        // const services = searchParams.getAll('services');
        const maxPrice = searchParams.get('maxPrice');
        const searchQuery = searchParams.get('q')?.toLowerCase();

        // Filter for Prisma
        const where: any = {};

        // Filter by typology
        if (typology) {
            where.typology = typology;
        }

        // Filter by services (must have ALL specified services, otherwise use SOME instead of EVERY)
        // if (services.length > 0) {
        //     where.services = {
        //         every: {
        //             id: {
        //                 in: services.map(serviceId => parseInt(serviceId))
        //             }
        //         }
        //     };
        // }

        // Filter by price
        if (maxPrice) {
            where.price = {
                lte: parseFloat(maxPrice)
            };
        }

        // Text search filter
        if (searchQuery) {
            where.OR = [
                { name: { contains: searchQuery, lte: 'insensitive' } },
                {
                    address: {
                        city: { contains: searchQuery, lte: 'insensitive' }
                    }
                },
                {
                    address: {
                        country: { contains: searchQuery, lte: 'insensitive' }
                    }
                },
                {
                    services: {
                        some: {
                            detail: { contains: searchQuery, lte: 'insensitive' }
                        }
                    }
                }
            ];
        }

        const data = await prisma.space.findMany({
            where,
            select: {
                id: true,
                name: true,
                price: true,
                avgRating: true,
                address: {
                    select: {
                        city: true,
                        country: true,
                    }
                },
                images: true,
                typology: true,
                services: {
                    select: {
                        id: true,
                        detail: true,
                    }
                },
            }
        });

        // Ensure only the first image is included in the images array
        const spaces = data.map(space => ({
            ...space,
            images: space.images && Array.isArray(space.images) && space.images.length > 0
                ? [space.images[0]]  // Take only the first element
                : []  // Or an empty array if no images exist
        }));

        return NextResponse.json(spaces);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
    }
}

// Handles POST requests to /api/spaces
// Creates a new space
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const setFullSpaceBooking = body.typology === 'MEETING_ROOMS' ? true : false;
        const newSpace = await prisma.space.create({
            data: {
                name: body.name,
                agencyId: body.agencyId,
                description: body.description,
                seats: body.seats,
                isFullSpaceBooking: setFullSpaceBooking,
                typology: body.typology,
                price: body.price,
                avgRating: body.avgRating,
                address: {
                    create: body.address,
                },
                // Connect or create services
                // services: {
                //     connectOrCreate: body.services.map((service: { id: string, detail: string }) => ({
                //         where: { id: service.id },
                //         create: { detail: service.detail },
                //     })),
                // },
                // Connect existing services by their IDs
                services: {
                    connect: body.services.map((serviceId: string) => ({ id: parseInt(serviceId) })),
                },
                // Images are optional
                images: body.images ? body.images : undefined,
            },
        });
        return NextResponse.json(newSpace, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create space' + error }, { status: 500 });
    }
}