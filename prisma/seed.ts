import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Creazione di un'agenzia
    const agencyUser = await prisma.user.create({
        data: {
            id: 'agency-user-1',
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
            id: 'client-user-1',
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

    // Creazione di uno spazio
    const space = await prisma.space.create({
        data: {
            name: 'Spazio 1',
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
    });

    // Creazione di una prenotazione
    const booking = await prisma.booking.create({
        data: {
            clientId: clientUser.client!.id,
            spaceId: space.id,
            bookingDate: new Date('2023-11-01T10:00:00Z'),
            seatsBooked: 5,
        },
    });

    // Creazione di una recensione
    const review = await prisma.review.create({
        data: {
            clientId: clientUser.client!.id,
            spaceId: space.id,
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