import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllGrievances = async () => {
    return await prisma.grievance.findMany({
        orderBy: {
            date: 'desc',
        },
        include: {
            student: {
                select: {
                    firstName: true,
                    lastName: true,
                    rollNumber: true,
                    block: true,
                    roomNumber: true,
                }
            }
        }
    });
};

export const getMyGrievances = async (userId) => {
    const student = await prisma.student.findUnique({
        where: { userId }
    });

    if (!student) {
        throw new Error("Student profile not found for this user.");
    }

    return await prisma.grievance.findMany({
        where: {
            studentId: student.id
        },
        orderBy: {
            date: 'desc',
        }
    });
};

export const createGrievance = async (userId, data) => {
    const student = await prisma.student.findUnique({
        where: { userId }
    });

    if (!student) {
        throw new Error("Student profile not found for this user.");
    }

    return await prisma.grievance.create({
        data: {
            problem: data.problem,
            image: data.image || null,
            studentId: student.id
        }
    });
};

export const updateGrievance = async (userId, grievanceId, data) => {
    const student = await prisma.student.findUnique({
        where: { userId }
    });

    if (!student) {
        throw new Error("Student profile not found for this user.");
    }

    // Verify ownership
    const grievance = await prisma.grievance.findUnique({
        where: { id: grievanceId }
    });

    if (!grievance) {
        throw new Error("Grievance not found.");
    }

    if (grievance.studentId !== student.id) {
        throw new Error("You are not authorized to update this grievance.");
    }

    return await prisma.grievance.update({
        where: { id: grievanceId },
        data: {
            problem: data.problem,
            image: data.image !== undefined ? data.image : grievance.image
        }
    });
};

export const deleteGrievance = async (userId, grievanceId) => {
    const student = await prisma.student.findUnique({
        where: { userId }
    });

    if (!student) {
        throw new Error("Student profile not found for this user.");
    }

    // Verify ownership
    const grievance = await prisma.grievance.findUnique({
        where: { id: grievanceId }
    });

    if (!grievance) {
        throw new Error("Grievance not found.");
    }

    if (grievance.studentId !== student.id) {
        throw new Error("You are not authorized to delete this grievance.");
    }

    return await prisma.grievance.delete({
        where: { id: grievanceId }
    });
};

