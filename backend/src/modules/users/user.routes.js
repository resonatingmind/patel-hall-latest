import express from "express";
import {
  createUser,
  bulkCreateUsers,
  getMe,
  getUsersByRole,
  createAdministrativeMember,
  getAllAdministrativeMembers,
  updateAdministrativeMember,
  deleteAdministrativeMember,
  updateMyProfile,
  getWebTeam,
  getAdministrationPage,
} from "./user.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";

const router = express.Router();

// Public: Get web team members (ADMIN role)
router.get("/web-team", getWebTeam);

// Public: Get administration members for the Administration page
router.get("/administration-page", getAdministrationPage);

// Any authenticated user can fetch their own profile
router.get("/me", authenticate, getMe);

// Update own profile (any authenticated student/council member)
router.put("/me/profile", authenticate, updateMyProfile);

// Allow fetching users by role
router.get(
  "/role/:role",
  authenticate,
  authorize("ADMIN", "WARDEN", "COUNCIL"),
  getUsersByRole,
);

// Base user creation (Supabase + Prisma)
router.post("/create", authenticate, authorize("ADMIN"), createUser);
router.post("/bulk-create", authenticate, authorize("ADMIN"), bulkCreateUsers);

// Create an Administrative member (User + Administration profile)
router.post(
  "/administration/create",
  authenticate,
  authorize("ADMIN"),
  createAdministrativeMember,
);

// Get all administrative members
router.get(
  "/administration",
  authenticate,
  authorize("ADMIN"),
  getAllAdministrativeMembers,
);

// Update an administrative member
router.put(
  "/administration/:id",
  authenticate,
  authorize("ADMIN"),
  updateAdministrativeMember,
);

// Delete an administrative member
router.delete(
  "/administration/:id",
  authenticate,
  authorize("ADMIN"),
  deleteAdministrativeMember,
);

export default router;
