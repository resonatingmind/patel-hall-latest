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

export const getEventById = async (id) => {
    return await prisma.event.findUnique({
        where: { id },
        include: {
            results: {
                orderBy: {
                    year: 'desc',
                },
            },
        },
    });
};

export const getEventParticipations = async (eventId, status) => {
    return await prisma.participationLog.findMany({
        where: { eventId, status },
        include: {
            student: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    rollNumber: true,
                    department: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const updateParticipationStatus = async (eventId, logId, status) => {
    // Verify participation belongs to the event
    const participation = await prisma.participationLog.findUnique({
        where: { id: logId }
    });
    if (!participation || participation.eventId !== eventId) {
        throw new Error('Participation record not found for this event.');
    }

    return await prisma.participationLog.update({
        where: { id: logId },
        data: { status },
    });
};

export const addEventParticipant = async (eventId, data) => {
    // Check if student exists
    const student = await prisma.student.findUnique({
        where: { rollNumber: data.rollNumber }
    });
    
    if (!student) {
        throw new Error('Student with the given roll number not found.');
    }

    // Check if participation already exists
    const existing = await prisma.participationLog.findUnique({
        where: {
            studentId_eventId: {
                studentId: student.id,
                eventId,
            }
        }
    });

    if (existing) {
        throw new Error('Student is already participating or has applied for this event.');
    }

    return await prisma.participationLog.create({
        data: {
            studentId: student.id,
            eventId,
            role: data.role || 'MEMBER',
            status: 'APPROVED',
            year: data.year ? parseInt(data.year, 10) : new Date().getFullYear(),
        },
        include: {
            student: {
                 select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    rollNumber: true,
                    department: true,
                },
            }
        }
    });
};

export const removeEventParticipant = async (eventId, logId) => {
    const participation = await prisma.participationLog.findUnique({
        where: { id: logId }
    });
    if (!participation || participation.eventId !== eventId) {
        throw new Error('Participation record not found for this event.');
    }

    return await prisma.participationLog.delete({
        where: { id: logId },
    });
};

export const addEventResult = async (eventId, data) => {
    // Check if result for this year and position already exists (optional logic, but schema allows multiple?)
    // Let's just create it directly
    return await prisma.eventResult.create({
        data: {
            eventId,
            year: parseInt(data.year, 10),
            position: parseInt(data.position, 10),
        },
    });
};
