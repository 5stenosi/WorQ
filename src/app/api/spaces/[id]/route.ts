import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Disable body parsing for this route
// This is necessary to handle file uploads correctly
export const config = {
    api: {
        bodyParser: false,
    },
};

// Define the upload path for images
const uploadPath = path.join(process.cwd(), 'public', 'uploads');

// Handles GET requests to /api/spaces/[id]
// Returns a single space
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        // Convert the ID to a number
        const spaceId = parseInt(id);

        // Check if the ID is valid
        if (isNaN(spaceId)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        // Fetch the space with its related data
        const space = await prisma.space.findUnique({
            where: { id: spaceId },
            include: { address: true, services: true, bookings: true, reviews: true }
        });

        if (!space) {
            return NextResponse.json({ error: 'Space not found' }, { status: 404 });
        }

        return NextResponse.json(space);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Handles PUT requests to /api/spaces/[id]
// Updates a single space
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        // Check if user is authenticated
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        if (session.user.role !== 'AGENCY') {
            return NextResponse.json({ error: "User not authorized" }, { status: 403 });
        }

        const { id } = params;

        // Convert the ID to a number
        const spaceId = parseInt(id);

        if (isNaN(spaceId)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        const formData = await request.formData();

        // Handle images
        const metadata = JSON.parse(formData.get('metadata') as string);
        const files = formData.getAll('files') as File[];
        const savedImagePaths: string[] = [];

        console.log('Metadata:', metadata);
        console.log('Files:', files);

        // Handle address
        const nominatimAddress = metadata.fullAddress;

        // Update the space in the database
        const updatedSpace = await prisma.space.update({
            where: { id: spaceId },
            data: {
                name: metadata.name,
                description: metadata.description,
                seats: parseInt(metadata.seats),
                isFullSpaceBooking: metadata.typology === 'MEETING_ROOMS',
                typology: metadata.typology,
                price: parseFloat(metadata.price),

                // Include address update only if present
                ...(nominatimAddress && {
                    address: {
                        update: {
                            street: nominatimAddress.address.road || '',
                            number: nominatimAddress.address.house_number || null,
                            city:
                                nominatimAddress.address.city ||
                                nominatimAddress.address.town ||
                                nominatimAddress.address.village ||
                                '',
                            zip: nominatimAddress.address.postcode || '',
                            country: nominatimAddress.address.country || '',
                            latitude: parseFloat(nominatimAddress.lat) || 0,
                            longitude: parseFloat(nominatimAddress.lon) || 0,
                        },
                    },
                }),
                services: metadata.services && metadata.services.length > 0
                    ? {
                        set: metadata.services.map((serviceId: string) => ({ id: parseInt(serviceId) })),
                    }
                    : {
                        set: [], // if the user has deselected all services
                    }
            },
        });

        // If there are files, handle image uploads
        if (files && files.length > 0) {
            const spaceFolder = `space${spaceId}`;
            const spaceFolderPath = path.join(uploadPath, spaceFolder);

            // Create the folder if it doesn't exist
            await fs.mkdir(spaceFolderPath, { recursive: true });

            // Remove existing images in the folder
            try {
                const existingFiles = await fs.readdir(path.join(uploadPath, spaceFolder));
                for (const file of existingFiles) {
                    await fs.unlink(path.join(uploadPath, spaceFolder, file));
                }
            } catch (fsError) {
                console.error('Failed to clear existing images:', fsError);
            }

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
                where: { id: spaceId },
                data: {
                    images: savedImagePaths,
                }
            });
        }

        return NextResponse.json(updatedSpace, { status: 200 });
    } catch (error) {
        console.log('Error updating space:', error);
        return NextResponse.json({ error: 'Update failed' + error }, { status: 500 });
    }
}

// Handles DELETE requests to /api/spaces/[id]
// Deletes a single space
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Check if user is authenticated
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        if (session.user.role !== 'AGENCY') {
            return NextResponse.json({ error: "User not authorized" }, { status: 403 });
        }

        const { id } = params;

        // Convert the ID to a number
        const spaceId = parseInt(id);

        if (isNaN(spaceId)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        // Delete the space from the database
        const deletedSpace = await prisma.space.delete({
            where: { id: spaceId },
        });

        const folderPath = path.join(process.cwd(), 'public', 'uploads', `space${id}`);

        // Attempt to delete the folder containing the space's images
        try {
            await fs.rm(folderPath, { recursive: true, force: true });
        } catch (fsError) {
            console.error('Failed to delete folder:', fsError);
        }

        return NextResponse.json(deletedSpace);
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' + error }, { status: 500 });
    }
}