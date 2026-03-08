import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getEvents = async (category) => {
  const where = {};

  if (category) {
    where.category = category;
  }

  return await prisma.event.findMany({
    where,
    orderBy: {
      name: "asc",
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
          year: "desc",
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
      createdAt: "desc",
    },
  });
};

export const updateParticipationStatus = async (eventId, logId, status) => {
  // Verify participation belongs to the event
  const participation = await prisma.participationLog.findUnique({
    where: { id: logId },
  });
  if (!participation || participation.eventId !== eventId) {
    throw new Error("Participation record not found for this event.");
  }

  return await prisma.participationLog.update({
    where: { id: logId },
    data: { status },
  });
};

export const updateParticipationRole = async (eventId, logId, role) => {
  // Verify participation belongs to the event
  const participation = await prisma.participationLog.findUnique({
    where: { id: logId },
  });
  if (!participation || participation.eventId !== eventId) {
    throw new Error("Participation record not found for this event.");
  }

  return await prisma.participationLog.update({
    where: { id: logId },
    data: { role },
  });
};

export const addEventParticipant = async (eventId, data) => {
  // Check if student exists
  const student = await prisma.student.findUnique({
    where: { rollNumber: data.rollNumber },
  });

  if (!student) {
    throw new Error("Student with the given roll number not found.");
  }

  // Check if participation already exists
  const existing = await prisma.participationLog.findUnique({
    where: {
      studentId_eventId: {
        studentId: student.id,
        eventId,
      },
    },
  });

  if (existing) {
    throw new Error(
      "Student is already participating or has applied for this event.",
    );
  }

  return await prisma.participationLog.create({
    data: {
      studentId: student.id,
      eventId,
      role: data.role || "MEMBER",
      status: "APPROVED",
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
      },
    },
  });
};

export const removeEventParticipant = async (eventId, logId) => {
  const participation = await prisma.participationLog.findUnique({
    where: { id: logId },
  });
  if (!participation || participation.eventId !== eventId) {
    throw new Error("Participation record not found for this event.");
  }

  return await prisma.participationLog.delete({
    where: { id: logId },
  });
};

export const addEventResult = async (eventId, data) => {
  const year = parseInt(data.year, 10);
  const position = parseInt(data.position, 10);

  return await prisma.eventResult.upsert({
    where: {
      eventId_year: {
        eventId,
        year,
      },
    },
    update: {
      position,
      caption: data.caption,
    },
    create: {
      eventId,
      year,
      position,
      caption: data.caption,
    },
  });
};

export const deleteEventResult = async (eventId, resultId) => {
  const result = await prisma.eventResult.findUnique({
    where: { id: resultId },
  });
  if (!result || result.eventId !== eventId) {
    throw new Error("Result record not found for this event.");
  }

  return await prisma.eventResult.delete({
    where: { id: resultId },
  });
};

export const getEventResultsByCategory = async (category) => {
  const results = await prisma.eventResult.findMany({
    where: {
      event: {
        category,
      },
    },
    include: {
      event: {
        select: {
          name: true,
          category: true,
        },
      },
    },
    orderBy: [{ year: "desc" }, { position: "asc" }],
  });

  // Group results by year
  const grouped = {};
  for (const result of results) {
    if (!grouped[result.year]) {
      grouped[result.year] = [];
    }
    grouped[result.year].push({
      id: result.id,
      eventName: result.event.name,
      position: result.position,
      caption: result.caption,
      year: result.year,
    });
  }

  return grouped;
};

export const getOverallStandingsByCategory = async (category) => {
  return await prisma.overallStanding.findMany({
    where: { category },
    orderBy: { year: "desc" },
  });
};
