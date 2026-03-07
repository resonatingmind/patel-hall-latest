import { prisma } from "../../config/prisma.js";

// Get all positions and the students currently assigned to them
export const getPositionsService = async () => {
  return await prisma.hallPosition.findMany({
    include: {
      studentPositions: {
        include: {
          student: true
        }
      }
    }
  });
};

// Create a new position
export const createPositionService = async (name, description) => {
  return await prisma.hallPosition.create({
    data: {
      name,
      description
    }
  });
};

// Delete a position
export const deletePositionService = async (id) => {
  return await prisma.hallPosition.delete({
    where: { id }
  });
};

// Assign a student to a position
export const assignPositionService = async (studentId, positionId) => {
  return await prisma.$transaction(async (tx) => {
    // Check if the student exists
    const student = await tx.student.findUnique({
      where: { id: studentId },
      include: { user: true }
    });
    if (!student) throw new Error("Student not found");

    // Check if the position exists
    const position = await tx.hallPosition.findUnique({
      where: { id: positionId }
    });
    if (!position) throw new Error("Position not found");

    // Check if already assigned
    const existing = await tx.studentPosition.findUnique({
      where: {
        studentId_positionId: { studentId, positionId }
      }
    });

    if (existing) {
      throw new Error("Student is already assigned to this position");
    }

    // Create the StudentPosition record
    const studentPosition = await tx.studentPosition.create({
      data: {
        studentId,
        positionId,
        startDate: new Date()
      }
    });

    // Update the User role to COUNCIL
    if (student.user.role !== "COUNCIL" && student.user.role !== "WARDEN" && student.user.role !== "ADMIN") {
      await tx.user.update({
        where: { id: student.userId },
        data: { role: "COUNCIL" }
      });
    }

    return studentPosition;
  });
};

// Unassign a student from a position
export const unassignPositionService = async (studentId, positionId) => {
  return await prisma.$transaction(async (tx) => {
    // Find the active student position
    const studentPosition = await tx.studentPosition.findUnique({
      where: {
        studentId_positionId: { studentId, positionId }
      }
    });

    if (!studentPosition) throw new Error("Position assignment not found");

    // Remove the assignment
    await tx.studentPosition.delete({
      where: { id: studentPosition.id }
    });

    // Check if the student holds any other active positions
    const otherActivePositions = await tx.studentPosition.findFirst({
      where: { studentId }
    });

    // If no other active positions, revert role to STUDENT
    if (!otherActivePositions) {
      const student = await tx.student.findUnique({
        where: { id: studentId },
        include: { user: true }
      });
      // only demote if they are COUNCIL (not WARDEN or ADMIN)
      if (student.user.role === "COUNCIL") {
        await tx.user.update({
            where: { id: student.userId },
            data: { role: "STUDENT" }
        });
      }
    }

    return studentPosition;
  });
};
