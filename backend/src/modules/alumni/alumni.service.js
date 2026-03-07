import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllAlumni = async () => {
  return await prisma.alumni.findMany({
    orderBy: {
      batchYear: "desc",
    },
  });
};

export const createAlumni = async (data) => {
  const { fullName, department, batchYear } = data;

  if (!fullName || !department || !batchYear) {
    throw new Error('All fields (fullName, department, batchYear) are required.');
  }

  // Ensure batchYear is an integer as defined in the Prisma schema
  const parsedBatchYear = parseInt(batchYear, 10);
  if (isNaN(parsedBatchYear)) {
    throw new Error('batchYear must be a valid number.');
  }

  return await prisma.alumni.create({
    data: {
      fullName,
      department,
      batchYear: parsedBatchYear,
    },
  });
};

export const createBulkAlumni = async (alumniList) => {
  if (!Array.isArray(alumniList) || alumniList.length === 0) {
    throw new Error('alumniList must be a non-empty array.');
  }

  const validAlumni = alumniList.map(alum => {
    const { fullName, department, batchYear } = alum;
    if (!fullName || !batchYear) {
      throw new Error('Fields (fullName, batchYear) are required for all entries.');
    }
    const parsedBatchYear = parseInt(batchYear, 10);
    if (isNaN(parsedBatchYear)) {
      throw new Error('batchYear must be a valid number.');
    }
    return {
      fullName,
      department: department || "Unknown",
      batchYear: parsedBatchYear,
    };
  });

  return await prisma.alumni.createMany({
    data: validAlumni,
    skipDuplicates: true,
  });
};
