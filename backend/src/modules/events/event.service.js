import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEvents = async (category) => {
    const where = {};

    if (category) {
        where.category = category;
    }

    return await prisma.event.findMany({
        where,
        orderBy: {
            name: 'asc',
        },
    });
};

