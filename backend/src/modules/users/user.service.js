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
    include: { student: true, administration: true }
  });
  if (!user) throw new Error("User not found in database.");
  return user;
};

const getUsersByRoleService = async (role) => {
  // Query Prisma for users with the specified role and include the administration relation
  const users = await prisma.user.findMany({ 
    where: { role },
    include: { administration: true } 
  });
  
  // Format the returned user response to map the administration details cleanly
  return users.map(user => ({
    ...user,
    name: user.administration 
      ? `${user.administration.firstName} ${user.administration.lastName}`.trim() 
      : null,
    position: user.administration?.position || null,
    phone: user.administration?.phone || null,
    office: user.administration?.office || null,
  }));
};

export { createUserService, bulkCreateUsersService, getMeService, getUsersByRoleService };
