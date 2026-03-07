import express from "express";
import {
  getStudents,
  createStudent,
  bulkImportStudents,
  updateStudent,
  deleteStudent,
  resetStudentPassword,
} from "./student.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";

const router = express.Router();

// Get all students (Wardens, Council, Admin)
router.get("/", authenticate, authorize("WARDEN", "ADMIN", "COUNCIL", "STUDENT"), getStudents);

// Add single student (Warden, Admin)
router.post("/create", authenticate, authorize("WARDEN", "ADMIN"), createStudent);

// Bulk import students (Warden, Admin)
router.post("/bulk-create", authenticate, authorize("WARDEN", "ADMIN"), bulkImportStudents);

// Update student (Warden, Admin)
router.put("/:id", authenticate, authorize("WARDEN", "ADMIN"), updateStudent);

// Delete student (Warden, Admin)
router.delete("/:id", authenticate, authorize("WARDEN", "ADMIN"), deleteStudent);

// Reset student password (Warden, Admin)
router.post("/:id/reset-password", authenticate, authorize("WARDEN", "ADMIN"), resetStudentPassword);

export default router;
