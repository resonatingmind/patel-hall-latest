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
    userId = existingUser.id;
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
    department,
    block,
    roomNumber,
    joiningYear,
    jobProfile,
  } = updateData;

  const student = await prisma.student.update({
    where: { id: studentId },
    data: {
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      department: department ?? undefined,
      block: block ?? undefined,
      roomNumber: roomNumber !== undefined ? parseInt(roomNumber) : undefined,
      joiningYear:
        joiningYear !== undefined ? parseInt(joiningYear) : undefined,
      jobProfile: jobProfile ?? undefined,
    },
  });

  return student;
};

// Delete a student and linked user/auth account
export const deleteStudentService = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const userId = student.userId;

  await prisma.student.delete({
    where: { id: studentId },
  });

  await prisma.user.delete({
    where: { id: userId },
  });

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(`Failed to delete user from auth: ${error.message}`);
  }

  return { success: true };
};

// Reset a student's password to their roll number
export const resetStudentPasswordService = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const { userId, rollNumber } = student;

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: rollNumber,
  });

  if (error) {
    throw new Error(`Failed to reset password: ${error.message}`);
  }

  return { success: true };
};
