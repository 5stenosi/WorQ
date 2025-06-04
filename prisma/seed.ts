import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import test from 'node:test';
const prisma = new PrismaClient();

async function main() {
    // Ensure all services have a valid iconName during seeding
    const services = await Promise.all([
        prisma.service.create({ data: { id: 1, detail: 'Free Wi-Fi', iconName: 'wifi' } }),
        prisma.service.create({ data: { id: 2, detail: 'Stationery', iconName: 'pen' } }),
        prisma.service.create({ data: { id: 3, detail: 'Printer', iconName: 'print' } }),
        prisma.service.create({ data: { id: 4, detail: 'Scanner', iconName: 'print' } }),
        prisma.service.create({ data: { id: 5, detail: 'Whiteboard', iconName: 'chalkboard' } }),
        prisma.service.create({ data: { id: 6, detail: 'Desktop', iconName: 'desktop' } }),
        prisma.service.create({ data: { id: 7, detail: 'Projector', iconName: 'video' } }),
        prisma.service.create({ data: { id: 8, detail: 'Disability Access', iconName: 'wheelchair' } }),
        prisma.service.create({ data: { id: 9, detail: 'Air Conditioning', iconName: 'snowflake' } }),
        prisma.service.create({ data: { id: 10, detail: 'Quiet Zones', iconName: 'volume-xmark' } }),
        prisma.service.create({ data: { id: 11, detail: 'Vending Machines', iconName: 'coffee' } }),
        prisma.service.create({ data: { id: 12, detail: 'Catering', iconName: 'utensils' } }),
        prisma.service.create({ data: { id: 13, detail: 'Video Conference', iconName: 'video' } }),
        prisma.service.create({ data: { id: 14, detail: 'Kitchenette', iconName: 'utensils' } }),
        prisma.service.create({ data: { id: 15, detail: 'Child-friendly', iconName: 'child' } }),
        prisma.service.create({ data: { id: 16, detail: 'Pet-friendly', iconName: 'dog' } }),
        prisma.service.create({ data: { id: 17, detail: 'Parking', iconName: 'parking' } }),
        prisma.service.create({ data: { id: 18, detail: 'Lockers', iconName: 'lock' } }),
        prisma.service.create({ data: { id: 19, detail: 'Charging Stations', iconName: 'bolt' } }),
    ]);

    // Creation of a test user (client and agency) with a hashed password
    const testPassword = 'password123'; // Password in chiaro per i test
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    const testClientUser = await prisma.user.upsert({
        where: { email: 'client@admin.com' },
        update: {}, // No updates for now
        
        create: {
            email: 'client@admin.com',
            password: hashedPassword,
            role: 'CLIENT',
            oauthProvider: 'APP',
            client: {
                create: {
                    name: 'Test',
                    surname: 'Client',
                    cellphone: '1234567890',
                },
            },
        },
        include: { client: true },
    });  

    const testAgencyUser = await prisma.user.upsert({
        where: { email: 'agency@admin.com' },
        update: {}, // No updates for now
        
        create: {
            email: 'agency@admin.com',
            password: hashedPassword,
            role: 'AGENCY',
            oauthProvider: 'APP',
            agency: {
                create: {
                    name: 'Test Agency',
                    vatNumber: '12345678901',
                    telephone: '1234567890',
                },
            },
        },
        include: { client: true },
    });

    // Creation of multiple spaces
    const spaces = await Promise.all([
        prisma.space.create({
            data: {
                id : 1,
                name: 'Milano Meetings',
                agencyId: testAgencyUser.id,
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
                    connect: [
                        { detail: 'Free Wi-Fi' },
                        { detail: 'Printer' },
                    ],
                },
            },
        }),
        prisma.space.create({
            data: {
                id : 2,
                name: 'RomOffice',
                agencyId: testAgencyUser.id,
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
                    connect: [
                        { detail: 'Air Conditioning' },
                        { detail: 'Vending Machines' },
                    ],
                },
            },
        }),
        prisma.space.create({
            data: {
                id : 3,
                name: 'Naples Outdoor',
                agencyId: testAgencyUser.id,
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
                    connect: [
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
            clientId: testClientUser.id,
            spaceId: spaces[0].id,
            bookingDate: new Date('2025-07-20T10:00:00Z'),
        },
    });

    // Creation of a review
    const review = await prisma.review.create({
        data: {
            clientId: testClientUser.id,
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