import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadPath = path.join(process.cwd(), 'public', 'uploads');

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
        const formData = await request.formData();

        // Handle images
        const metadata = JSON.parse(formData.get('metadata') as string);
        const files = formData.getAll('files') as File[];
        const savedImagePaths: string[] = [];

        // Handle address
        const nominatimAddress = metadata.fullAddress;

        const newSpace = await prisma.space.create({
            data: {
                name: metadata.name,
                description: metadata.description,
                seats: parseInt(metadata.seats),
                isFullSpaceBooking: metadata.typology === 'MEETING_ROOMS' ? true : false,
                typology: metadata.typology,
                price: parseFloat(metadata.price),
                avgRating: null,
                address: {
                    create: {
                        street: nominatimAddress.address.road,
                        number: nominatimAddress.address.house_number ? nominatimAddress.address.house_number : '',
                        city: nominatimAddress.address.city || nominatimAddress.address.town || nominatimAddress.address.village,
                        zip: nominatimAddress.address.postcode,
                        country: nominatimAddress.address.country,                        
                        latitude: parseFloat(nominatimAddress.lat),
                        longitude: parseFloat(nominatimAddress.lon),
                    }
                },
                // Connect existing services by their IDs
                services: {
                    connect: metadata.services.map((serviceId: string) => ({ id: parseInt(serviceId) })),
                },
                agency: {
                    connect: {
                        id: parseInt(metadata.agencyId),
                    }
                },
                // Images are optional
                images: undefined,
            }
        });

        if (files && files.length > 0) {
            const spaceFolder = `space${newSpace.id}`;
            const spaceFolderPath = path.join(uploadPath, spaceFolder);

            // Create the folder if it doesn't exist
            await fs.mkdir(spaceFolderPath, { recursive: true });

            // Save images
            for (const [index, file] of files.entries()) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileExtension = path.extname(file.name);
            const fileName = `image${index + 1}${fileExtension}`;
            const filePath = path.join(uploadPath, spaceFolder, fileName);

            await fs.writeFile(filePath, buffer);
            savedImagePaths.push(`/uploads/${spaceFolder}/${fileName}`);
            }

            // Update the space with the saved image paths
            await prisma.space.update({
            where: { id: newSpace.id },
            data: {
                images: savedImagePaths,
            }
            });
        }

        return NextResponse.json(newSpace, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create space' + error }, { status: 500 });
    }
}