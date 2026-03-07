import {
  createUserService,
  bulkCreateUsersService,
  getMeService,
  getUsersByRoleService
} from "./user.service.js";

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

export { createUser, bulkCreateUsers, getMe, getUsersByRole };
