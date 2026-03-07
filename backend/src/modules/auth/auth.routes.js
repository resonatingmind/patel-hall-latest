import express from "express";
import { signUp, checkUser } from "./auth.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";

const router = express.Router();

// Admin-only: create a new student account with full metadata
router.post("/signup", authenticate, authorize("ADMIN"), signUp);

// Utility: check whether an email is already registered
router.post("/check-user", authenticate, authorize("ADMIN"), checkUser);

export default router;
