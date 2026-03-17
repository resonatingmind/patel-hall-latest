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
  const { fullName, department, batchYear, profile, linkedin } = data;

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
      profile: profile || null,
      linkedin: linkedin || null,
    },
  });
};

export const updateAlumni = async (id, data) => {
  const { fullName, department, batchYear, profile, linkedin } = data;

  if (!fullName || !department || !batchYear) {
    throw new Error('All fields (fullName, department, batchYear) are required.');
  }

  const parsedBatchYear = parseInt(batchYear, 10);
  if (isNaN(parsedBatchYear)) {
    throw new Error('batchYear must be a valid number.');
  }

  return await prisma.alumni.update({
    where: { id },
    data: {
      fullName,
      department,
      batchYear: parsedBatchYear,
      profile: profile || null,
      linkedin: linkedin || null,
    },
  });
};

export const createBulkAlumni = async (alumniList) => {
  if (!Array.isArray(alumniList) || alumniList.length === 0) {
    throw new Error('alumniList must be a non-empty array.');
  }

  const createdAlumni = [];
  const failedAlumni = [];

  for (const alum of alumniList) {
    try {
      const { fullName, department, batchYear } = alum;
      if (!fullName || !batchYear) {
        throw new Error('Fields (fullName, batchYear) are required.');
      }
      const parsedBatchYear = parseInt(batchYear, 10);
      if (isNaN(parsedBatchYear)) {
        throw new Error('batchYear must be a valid number.');
      }
      const created = await prisma.alumni.create({
        data: {
          fullName,
          department: department || 'Unknown',
          batchYear: parsedBatchYear,
          profile: alum.profile || null,
          linkedin: alum.linkedin || null,
        },
      });
      createdAlumni.push(created);
    } catch (err) {
      failedAlumni.push({
        fullName: alum.fullName || '',
        batchYear: alum.batchYear || '',
        department: alum.department || '',
        error: err.message,
      });
    }
  }

  return {
    successCount: createdAlumni.length,
    failedCount: failedAlumni.length,
    createdAlumni,
    failedAlumni,
  };
};
