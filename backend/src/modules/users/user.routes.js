import express from "express";
import { createUser, bulkCreateUsers, getMe, getUsersByRole } from "./user.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";

const router = express.Router();

// Any authenticated user can fetch their own profile
router.get("/me", authenticate, getMe);

// Allow fetching users by role
router.get("/role/:role", authenticate, authorize("ADMIN", "WARDEN", "COUNCIL"), getUsersByRole);

router.post("/create", authenticate, authorize("ADMIN"), createUser);
router.post("/bulk-create", authenticate, authorize("ADMIN"), bulkCreateUsers);

export default router; 
