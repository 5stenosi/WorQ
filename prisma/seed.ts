import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Creazione di un'agenzia
    const agencyUser = await prisma.user.create({
        data: {
            email: 'agency@example.com',
            role: 'AGENCY',
            oauthProvider: 'GOOGLE',
            oauthId: 'oauth-agency-1',
            agency: {
                create: {
                    name: 'Agenzia 1',
                    vatNumber: '12345678901',
                    telephone: '1234567890',
                },
            },
        },
        include: { agency: true },
    });

    // Creazione di un cliente
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

    // Creazione di un cliente
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

    // Creazione di spazi multipli
    const spaces = await Promise.all([
        prisma.space.create({
            data: {
                name: 'Milano Meetings',
                agencyId: agencyUser.agency!.id,
                description: 'Un bellissimo spazio di coworking',
                seats: 10,
                numberOfSpaces: 1,
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
                        country: 'Italia',
                        latitude: 45.4642,
                        longitude: 9.19,
                    },
                },
                services: {
                    create: [
                        { detail: 'Wi-Fi gratuito' },
                        { detail: 'Stampante' },
                    ],
                },
            },
        }),
        prisma.space.create({
            data: {
                name: 'RomOffice',
                agencyId: agencyUser.agency!.id,
                description: 'Un altro spazio di coworking',
                seats: 15,
                numberOfSpaces: 2,
                isFullSpaceBooking: false,
                typology: 'PRIVATE_OFFICES',
                price: 150.0,
                avgRating: null,
                images: ['/uploads/space2/image1.jpg', '/uploads/space2/image2.jpg'],
                address: {
                    create: {
                        street: 'Via Torino',
                        number: '20',
                        city: 'Roma',
                        zip: '00100',
                        country: 'Italia',
                        latitude: 41.9028,
                        longitude: 12.4964,
                    },
                },
                services: {
                    create: [
                        { detail: 'Aria condizionata' },
                        { detail: 'Caffè gratuito' },
                    ],
                },
            },
        }),
        prisma.space.create({
            data: {
                name: 'Naples Outdoor',
                agencyId: agencyUser.agency!.id,
                description: 'Uno spazio moderno e attrezzato',
                seats: 20,
                numberOfSpaces: 3,
                isFullSpaceBooking: true,
                typology: 'OUTDOOR_SPACES',
                price: 200.0,
                avgRating: null,
                images: ['/uploads/space3/image1.jpg', '/uploads/space3/image2.jpg'],
                address: {
                    create: {
                        street: 'Corso Venezia',
                        number: '5',
                        city: 'Napoli',
                        zip: '80100',
                        country: 'Italia',
                        latitude: 40.8518,
                        longitude: 14.2681,
                    },
                },
                services: {
                    create: [
                        { detail: 'Proiettore' },
                        { detail: 'Servizio catering' },
                    ],
                },
            },
        }),
    ]);

    // Creazione di una prenotazione
    const booking = await prisma.booking.create({
        data: {
            clientId: clientUser.client!.id,
            spaceId: spaces[0].id,
            bookingDate: new Date('2023-11-01T10:00:00Z'),
            seatsBooked: 5,
        },
    });

    // Creazione di una recensione
    const review = await prisma.review.create({
        data: {
            clientId: clientUser.client!.id,
            spaceId: spaces[0].id,
            rating: 5,
            comment: 'Spazio fantastico!',
        },
    });

    console.log('Seed completato con successo!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });