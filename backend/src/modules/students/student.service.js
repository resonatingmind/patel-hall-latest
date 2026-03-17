import { prisma } from "../../config/prisma.js";
import { supabase as supabaseAdmin } from "../../config/supabase.js";

// Fetch all students (with optional filters in the future)
export const getStudentsService = async () => {
  const students = await prisma.student.findMany({
    orderBy: {
      firstName: "asc",
    },
  });
  return students;
};

// Add a single student & invite via Supabase magic link
export const createStudentService = async (studentData) => {
  const {
    firstName,
    lastName,
    email,
    rollNumber,
    department,
    block,
    roomNumber,
    joiningYear,
    jobProfile,
  } = studentData;

  // Check if a Student profile already exists for this roll number
  const existingStudent = await prisma.student.findUnique({
    where: { rollNumber },
  });
  if (existingStudent) {
    throw new Error(`Student with roll number ${rollNumber} already exists.`);
  }

  // 1️⃣ Create or retrieve Supabase Auth user
  let authUser;
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: rollNumber,
    email_confirm: true,
  });

  if (error) {
    // If user already exists in Supabase Auth, fetch them by email
    if (
      error.message?.includes("already been registered") ||
      error.message?.includes("already exists")
    ) {
      const { data: listData, error: listError } =
        await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw new Error(`Supabase error: ${listError.message}`);
      authUser = listData.users.find((u) => u.email === email);
      if (!authUser)
        throw new Error(`Could not find existing Supabase user for ${email}.`);
    } else {
      throw new Error(`Supabase user creation failed: ${error.message}`);
    }
  } else {
    authUser = data.user;
  }

  // 2️⃣ Create User in Prisma DB if not already present
  const existingUser = await prisma.user.findUnique({
    where: { email: authUser.email },
  });
  let userId;
  if (existingUser) {
    // If Prisma User ID doesn't match Supabase auth UID, sync them
    // so the auth middleware can find this user when they log in
    if (existingUser.id !== authUser.id) {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`UPDATE "Student" SET "userId" = ${authUser.id} WHERE "userId" = ${existingUser.id}`;
        await tx.$executeRaw`UPDATE "Administration" SET id = ${authUser.id} WHERE id = ${existingUser.id}`;
        await tx.$executeRaw`UPDATE "User" SET id = ${authUser.id} WHERE id = ${existingUser.id}`;
      });
    }
    userId = authUser.id;
  } else {
    await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email,
        role: "STUDENT",
      },
    });
    userId = authUser.id;
  }

  // 3️⃣ Create Student Profile in Prisma
  const student = await prisma.student.create({
    data: {
      userId,
      firstName,
      lastName,
      rollNumber,
      department,
      block,
      roomNumber: parseInt(roomNumber),
      joiningYear: parseInt(joiningYear),
      jobProfile: jobProfile || null,
    },
  });

  return student;
};

// Bulk Import Students
export const bulkCreateStudentsService = async (studentsList) => {
  const createdStudents = [];
  const failedStudents = [];

  for (const studentData of studentsList) {
    try {
      const student = await createStudentService(studentData);
      createdStudents.push(student);
    } catch (err) {
      failedStudents.push({
        email: studentData.email,
        rollNumber: studentData.rollNumber,
        error: err.message,
      });
    }
  }

  return {
    successCount: createdStudents.length,
    failedCount: failedStudents.length,
    createdStudents,
    failedStudents,
  };
};

// Update a student
export const updateStudentService = async (studentId, updateData) => {
  const {
    firstName,
    lastName,
    rollNumber,
    department,
    block,
    roomNumber,
    joiningYear,
    jobProfile,
    image,
    linkedin,
  } = updateData;

  // If rollNumber is being changed, verify it's unique
  if (rollNumber !== undefined) {
    const existing = await prisma.student.findUnique({
      where: { rollNumber },
    });
    if (existing && existing.id !== studentId) {
      throw new Error(
        `Roll number ${rollNumber} is already in use by another student.`,
      );
    }
  }

  const student = await prisma.student.update({
    where: { id: studentId },
    data: {
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      rollNumber: rollNumber ?? undefined,
      department: department ?? undefined,
      block: block ?? undefined,
      roomNumber: roomNumber !== undefined ? parseInt(roomNumber) : undefined,
      joiningYear:
        joiningYear !== undefined ? parseInt(joiningYear) : undefined,
      jobProfile: jobProfile !== undefined ? jobProfile || null : undefined,
      image: image !== undefined ? image || null : undefined,
      linkedin: linkedin !== undefined ? linkedin || null : undefined,
    },
  });

  return student;
};

// Delete a student and linked user/auth account
export const deleteStudentService = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const userId = student.userId;
  const email = student.user?.email;

  // Delete from Prisma first
  await prisma.student.delete({
    where: { id: studentId },
  });

  await prisma.user.delete({
    where: { id: userId },
  });

  // Delete from Supabase Auth - try stored ID first, fall back to email lookup
  let { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error && email) {
    const { data: listData, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (!listError && listData?.users) {
      const supabaseUser = listData.users.find((u) => u.email === email);
      if (supabaseUser) {
        const { error: retryError } = await supabaseAdmin.auth.admin.deleteUser(
          supabaseUser.id,
        );
        if (retryError) {
          throw new Error(
            `Failed to delete user from auth: ${retryError.message}`,
          );
        }
      }
    }
  }

  return { success: true };
};

// Reset a student's password to their roll number
export const resetStudentPasswordService = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  if (!student.user) {
    throw new Error("User account not found for this student");
  }

  const { rollNumber } = student;

  // Try resetting using stored userId first
  let { error } = await supabaseAdmin.auth.admin.updateUserById(
    student.userId,
    {
      password: rollNumber,
    },
  );

  // If stored userId doesn't match any Supabase user (ID mismatch from bulk import),
  // fall back to looking up the Supabase auth user by email
  if (error) {
    const { data: listData, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw new Error(`Auth lookup failed: ${listError.message}`);

    const supabaseUser = listData.users.find(
      (u) => u.email === student.user.email,
    );
    if (!supabaseUser) {
      throw new Error("User not found in authentication system");
    }

    const { error: retryError } = await supabaseAdmin.auth.admin.updateUserById(
      supabaseUser.id,
      {
        password: rollNumber,
      },
    );

    if (retryError) {
      throw new Error(`Failed to reset password: ${retryError.message}`);
    }
  }

  return { success: true };
};
