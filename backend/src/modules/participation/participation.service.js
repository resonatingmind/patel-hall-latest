import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMyParticipations = async (userId) => {
    const student = await prisma.student.findUnique({
        where: { userId }
    });

    if (!student) {
        throw new Error("Student profile not found for this user.");
    }

    return await prisma.participationLog.findMany({
        where: {
            studentId: student.id
        },
        include: {
            event: true,
        },
        orderBy: {
            createdAt: 'desc',
        }
    });
};

export const createParticipation = async (userId, data) => {
    const student = await prisma.student.findUnique({
        where: { userId }
    });

    if (!student) {
        throw new Error("Student profile not found for this user.");
    }

    // Ensure the selected event exists
    const event = await prisma.event.findUnique({
        where: { id: data.eventId }
    });

    if (!event) {
        throw new Error("Selected event not found.");
    }

    return await prisma.participationLog.create({
        data: {
            eventId: data.eventId,
            role: data.role,
            year: data.year ? parseInt(data.year, 10) : null,
            proof: data.proof || null,
            studentId: student.id
        },
        include: {
            event: true,
        },
    });
};
