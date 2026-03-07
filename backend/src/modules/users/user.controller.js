import {
  createUserService,
  bulkCreateUsersService,
  getMeService,
  getUsersByRoleService,
  getAllAdministrativeMembersService,
  updateAdministrativeMemberService,
  deleteAdministrativeMemberService,
} from "./user.service.js";
import { prisma } from "../../config/prisma.js";

const getMe = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);

    const user = await getMeService(req.user.id);

    res.json({
      role: user.role,
      email: user.email,
      student: user.student,
      administration: user.administration,
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    console.log("Create User Request Body:", req.body); // Debug log
    const { email, role, password } = req.body;

    if (!email || !role || !password) {
      return res.status(400).json({
        message: "Email, role, and password are required",
      });
    }

    const user = await createUserService(email, role, password);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const bulkCreateUsers = async (req, res) => {
  try {
    const { users } = req.body;

    if (!users || !Array.isArray(users)) {
      return res.status(400).json({
        message: "Users must be an array",
      });
    }

    const result = await bulkCreateUsersService(users);

    res.status(201).json({
      message: "Bulk user creation completed",
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    if (!role) {
      return res.status(400).json({
        message: "Role parameter is required",
      });
    }

    const users = await getUsersByRoleService(role.toUpperCase());

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const createAdministrativeMember = async (req, res) => {
  try {
    console.log("Create Administrative Member Body:", req.body);

    const {
      email,
      role,
      password,
      firstName,
      lastName,
      position,
      phone,
      office,
    } = req.body;

    if (!email || !role || !password || !firstName || !position) {
      return res.status(400).json({
        message:
          "Email, role, password, firstName and position are required fields",
      });
    }

    const normalizedRole = role.toUpperCase();
    const allowedRoles = ["ADMIN", "WARDEN"];

    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(400).json({
        message: `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}`,
      });
    }

    // 1️⃣ Create auth + application user
    const user = await createUserService(email, normalizedRole, password);

    // 2️⃣ Create Administration profile linked to the user
    const administration = await prisma.administration.create({
      data: {
        id: user.id,
        firstName,
        lastName: lastName || "",
        position,
        phone: phone || null,
        office: office || null,
      },
    });

    return res.status(201).json({
      message: "Administrative member created successfully",
      user: {
        ...user,
        administration,
      },
    });
  } catch (err) {
    console.error("Error creating administrative member:", err);
    return res.status(500).json({
      message: err.message || "Failed to create administrative member",
    });
  }
};

const getAllAdministrativeMembers = async (req, res) => {
  try {
    const members = await getAllAdministrativeMembersService();
    res.status(200).json(members);
  } catch (err) {
    console.error("Error fetching administrative members:", err);
    res.status(500).json({
      message: err.message || "Failed to fetch administrative members",
    });
  }
};

const updateAdministrativeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const updatedMember = await updateAdministrativeMemberService(id, updateData);

    res.status(200).json({
      message: "Administrative member updated successfully",
      member: updatedMember,
    });
  } catch (err) {
    console.error("Error updating administrative member:", err);
    res.status(500).json({
      message: err.message || "Failed to update administrative member",
    });
  }
};

const deleteAdministrativeMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // Prevent self-deletion
    if (id === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    await deleteAdministrativeMemberService(id);

    res.status(200).json({
      message: "Administrative member deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting administrative member:", err);
    res.status(500).json({
      message: err.message || "Failed to delete administrative member",
    });
  }
};

export {
  createUser,
  bulkCreateUsers,
  getMe,
  getUsersByRole,
  createAdministrativeMember,
  getAllAdministrativeMembers,
  updateAdministrativeMember,
  deleteAdministrativeMember,
};
