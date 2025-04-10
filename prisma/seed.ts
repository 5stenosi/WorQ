import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Services creation
    const services = await Promise.all([
        prisma.service.create({ data: { detail: 'Free Wi-Fi' } }),
        prisma.service.create({ data: { detail: 'Stationery' } }),
        prisma.service.create({ data: { detail: 'Printer' } }),
        prisma.service.create({ data: { detail: 'Scanner' } }),
        prisma.service.create({ data: { detail: 'Whiteboard' } }),
        prisma.service.create({ data: { detail: 'Desktop' } }),
        prisma.service.create({ data: { detail: 'Projector' } }),
        prisma.service.create({ data: { detail: 'Disability Access' } }),
        prisma.service.create({ data: { detail: 'Air Conditioning' } }),
        prisma.service.create({ data: { detail: 'Quiet Zones' } }), // Focus Rooms
        prisma.service.create({ data: { detail: 'Vending Machines' } }),
        prisma.service.create({ data: { detail: 'Catering' } }),
        prisma.service.create({ data: { detail: 'Video Conference' } }),
        prisma.service.create({ data: { detail: 'Kitchenette' } }),
        prisma.service.create({ data: { detail: 'Child-friendly' } }),
        prisma.service.create({ data: { detail: 'Pet-friendly' } }),
        prisma.service.create({ data: { detail: 'Parking' } }),
        prisma.service.create({ data: { detail: 'Lockers' } }),
        prisma.service.create({ data: { detail: 'Charging Stations' } }),
    ]);

    // Creation of an agency
    const agencyUser = await prisma.user.create({
        data: {
            email: 'agency@example.com',
            role: 'AGENCY',
            oauthProvider: 'GOOGLE',
            oauthId: 'oauth-agency-1',
            agency: {
                create: {
                    name: 'Agency 1',
                    vatNumber: '12345678901',
                    telephone: '1234567890',
                },
            },
        },
        include: { agency: true },
    });

    // Creation of a client
    const clientUser = await prisma.user.create({
        data: {
            email: 'client@example.com',
            role: 'CLIENT',
            oauthProvider: 'GOOGLE',
            oauthId: 'oauth-client-1',
            client: {
                create: {
                    name: 'Mario',
                    surname: 'Rossi',
                    cellphone: '0987654321',
                },
            },
        },
        include: { client: true },
    });

    // Creation of another client
    const clientUser2 = await prisma.user.create({
        data: {
            email: 'client2@example.com',
            role: 'CLIENT',
            oauthProvider: 'GOOGLE',
            oauthId: 'oauth-client2-1',
            client: {
                create: {
                    name: 'Luigi',
                    surname: 'Verdi',
                    cellphone: '3287654321',
                },
            },
        },
        include: { client: true },
    });

    // Creation of multiple spaces
    const spaces = await Promise.all([
        prisma.space.create({
            data: {
                name: 'Milano Meetings',
                agencyId: agencyUser.agency!.id,
                description: 'A beautiful coworking space',
                seats: 10,
                isFullSpaceBooking: true,
                typology: 'MEETING_ROOMS',
                price: 100.0,
                avgRating: 5,
                images: [
                    '/uploads/space1/image1.jpg',
                    '/uploads/space1/image2.jpg',
                ],
                address: {
                    create: {
                        street: 'Via Roma',
                        number: '10',
                        city: 'Milano',
                        zip: '20100',
                        country: 'Italy',
                        latitude: 45.4642,
                        longitude: 9.19,
                    },
                },
                services: {
                    create: [
                        { detail: 'Free Wi-Fi' },
                        { detail: 'Printer' },
                    ],
                },
            },
        }),
        prisma.space.create({
            data: {
                name: 'RomOffice',
                agencyId: agencyUser.agency!.id,
                description: 'Another coworking space',
                seats: 15,
                isFullSpaceBooking: false,
                typology: 'PRIVATE_OFFICES',
                price: 150.0,
                avgRating: null,
                images: ['/uploads/space2/image1.jpg', '/uploads/space2/image2.jpg'],
                address: {
                    create: {
                        street: 'Via Torino',
                        number: '20',
                        city: 'Rome',
                        zip: '00100',
                        country: 'Italy',
                        latitude: 41.9028,
                        longitude: 12.4964,
                    },
                },
                services: {
                    create: [
                        { detail: 'Air Conditioning' },
                        { detail: 'Vending Machines' },
                    ],
                },
            },
        }),
        prisma.space.create({
            data: {
                name: 'Naples Outdoor',
                agencyId: agencyUser.agency!.id,
                description: 'A modern and well-equipped space',
                seats: 20,
                isFullSpaceBooking: true,
                typology: 'OUTDOOR_SPACES',
                price: 200.0,
                avgRating: null,
                images: ['/uploads/space3/image1.jpg', '/uploads/space3/image2.jpg'],
                address: {
                    create: {
                        street: 'Corso Venezia',
                        number: '5',
                        city: 'Naples',
                        zip: '80100',
                        country: 'Italy',
                        latitude: 40.8518,
                        longitude: 14.2681,
                    },
                },
                services: {
                    create: [
                        { detail: 'Projector' },
                        { detail: 'Catering' },
                    ],
                },
            },
        }),
    ]);

    // Creation of a booking
    const booking = await prisma.booking.create({
        data: {
            clientId: clientUser.client!.id,
            spaceId: spaces[0].id,
            bookingDate: new Date('2023-11-01T10:00:00Z'),
        },
    });

    // Creation of a review
    const review = await prisma.review.create({
        data: {
            clientId: clientUser.client!.id,
            spaceId: spaces[0].id,
            rating: 5,
            comment: 'Fantastic space!',
        },
    });

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });