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

export const createGrievance = async (userId, data) => {
    // Determine the student associated with the user
    // userId is coming from the decoded JWT token
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

