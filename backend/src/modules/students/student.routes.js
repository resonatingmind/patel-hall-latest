import express from "express";
import { getStudents, createStudent, bulkImportStudents } from "./student.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";

const router = express.Router();

// Get all students (Wardens, Council, Admin)
router.get("/", authenticate, authorize("WARDEN", "ADMIN", "COUNCIL"), getStudents);

// Add single student (Warden, Admin)
router.post("/create", authenticate, authorize("WARDEN", "ADMIN"), createStudent);

// Bulk import students (Warden, Admin)
router.post("/bulk-create", authenticate, authorize("WARDEN", "ADMIN"), bulkImportStudents);

export default router;
