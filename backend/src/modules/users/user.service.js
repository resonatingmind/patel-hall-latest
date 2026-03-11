import { prisma } from "../../config/prisma.js";
import { supabase as supabaseAdmin } from "../../config/supabase.js";

//Create a new user
const createUserService = async (email, role, password) => {
  // 1️⃣ Create user in Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    email_confirm: true,
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const authUser = data.user;

  // 2️⃣ Create user in Prisma DB
  const user = await prisma.user.create({
    data: {
      id: authUser.id,
      email: authUser.email,
      role: role,
    },
  });

  return user;
};

const bulkCreateUsersService = async (users) => {
  const createdUsers = [];
  const failedUsers = [];

  for (const user of users) {
    try {
      const { email, role } = user;

      // 1️⃣ Create user in Supabase
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
        password: user.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const authUser = data.user;

      // 2️⃣ Store in Prisma
      const dbUser = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email,
          role: role,
        },
      });

      createdUsers.push(dbUser);
    } catch (err) {
      failedUsers.push({
        email: user.email,
        error: err.message,
      });
    }
  }

  return {
    createdUsers,
    failedUsers,
  };
};

const getMeService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { student: true, administration: true },
  });
  if (!user) {
    console.error(`DEBUG: User with id ${userId} not found in database.`);
    throw new Error("User not found in database.");
  }
  return user;
};

const getUsersByRoleService = async (role) => {
  // Query Prisma for users with the specified role and include the administration relation
  const users = await prisma.user.findMany({
    where: { role },
    include: { administration: true },
  });

  // Format the returned user response to map the administration details cleanly
  return users.map((user) => ({
    ...user,
    name: user.administration
      ? `${user.administration.firstName} ${user.administration.lastName}`.trim()
      : null,
    position: user.administration?.position || null,
    phone: user.administration?.phone || null,
    office: user.administration?.office || null,
  }));
};

// Get all administrative members (ADMIN, WARDEN, and OTHER roles)
const getAllAdministrativeMembersService = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "WARDEN", "OTHER"],
      },
    },
    include: {
      administration: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    firstName: user.administration?.firstName || "",
    lastName: user.administration?.lastName || "",
    position: user.administration?.position || "",
    dept: user.administration?.dept || null,
    phone: user.administration?.phone || null,
    office: user.administration?.office || null,
    image: user.administration?.image || null,
    linkedin: user.administration?.linkedin || null,
    name: user.administration
      ? `${user.administration.firstName} ${user.administration.lastName}`.trim()
      : null,
  }));
};

// Update an administrative member
const updateAdministrativeMemberService = async (userId, updateData) => {
  const {
    firstName,
    lastName,
    position,
    dept,
    phone,
    office,
    role,
    image,
    linkedin,
  } = updateData;

  // Update user role if provided
  if (role) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: role.toUpperCase() },
    });
  }

  // Update administration profile
  const administration = await prisma.administration.upsert({
    where: { id: userId },
    update: {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      position: position || undefined,
      dept: dept !== undefined ? dept : undefined,
      phone: phone || undefined,
      office: office || undefined,
      image: image !== undefined ? image : undefined,
      linkedin: linkedin !== undefined ? linkedin : undefined,
    },
    create: {
      id: userId,
      firstName: firstName || "",
      lastName: lastName || "",
      position: position || "",
      dept: dept || null,
      phone: phone || null,
      office: office || null,
      image: image || null,
      linkedin: linkedin || null,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { administration: true },
  });

  return {
    ...user,
    administration,
  };
};

// Delete an administrative member
const deleteAdministrativeMemberService = async (userId) => {
  // Delete administration profile first (due to foreign key constraint)
  await prisma.administration.deleteMany({
    where: { id: userId },
  });

  // Delete user from Prisma
  await prisma.user.delete({
    where: { id: userId },
  });

  // Delete user from Supabase Auth
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(`Failed to delete user from auth: ${error.message}`);
  }

  return { success: true };
};

// Update the authenticated user's own student profile
const updateMyProfileService = async (userId, updateData) => {
  // Find the student linked to this user
  const student = await prisma.student.findUnique({
    where: { userId },
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  const {
    firstName,
    lastName,
    block,
    roomNumber,
    linkedin,
    jobProfile,
    image,
  } = updateData;

  const updated = await prisma.student.update({
    where: { id: student.id },
    data: {
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      block: block ?? undefined,
      roomNumber: roomNumber !== undefined ? parseInt(roomNumber) : undefined,
      linkedin: linkedin ?? undefined,
      jobProfile: jobProfile ?? undefined,
      image: image ?? undefined,
    },
  });

  return updated;
};

// Get all administration members for the public Administration page
const getAdministrationPageService = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "WARDEN", "OTHER"] },
    },
    include: { administration: true },
    orderBy: { createdAt: "asc" },
  });

  return users
    .filter((user) => user.administration)
    .map((user) => ({
      id: user.id,
      firstName: user.administration.firstName,
      lastName: user.administration.lastName,
      name: `${user.administration.firstName} ${user.administration.lastName}`.trim(),
      role: user.role,
      position: user.administration.position,
      dept: user.administration.dept || null,
      phone: user.administration.phone || null,
      office: user.administration.office || null,
      image: user.administration.image || null,
      linkedin: user.administration.linkedin || null,
    }));
};

// Get web team members (ADMIN role users with administration profile)
const getWebTeamService = async () => {
  const users = await prisma.user.findMany({
    where: { role: "ADMIN" },
    include: { administration: true },
  });

  return users
    .filter((user) => user.administration)
    .map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.administration.firstName,
      lastName: user.administration.lastName,
      position: user.administration.position,
      image: user.administration.image || null,
      linkedin: user.administration.linkedin || null,
    }));
};

export {
  createUserService,
  bulkCreateUsersService,
  getMeService,
  getUsersByRoleService,
  getAllAdministrativeMembersService,
  updateAdministrativeMemberService,
  deleteAdministrativeMemberService,
  updateMyProfileService,
  getWebTeamService,
  getAdministrationPageService,
};
