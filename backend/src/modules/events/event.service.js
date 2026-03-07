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

export const createEvent = async (data) => {
    return await prisma.event.create({
        data,
    });
};

export const updateEvent = async (id, data) => {
    return await prisma.event.update({
        where: { id },
        data,
    });
};

export const deleteEvent = async (id) => {
    return await prisma.event.delete({
        where: { id },
    });
};
