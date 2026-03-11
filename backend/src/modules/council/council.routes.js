import express from "express";
import {
  getPositions,
  createPosition,
  deletePosition,
  assignPosition,
  unassignPosition,
  getCouncilMembers,
} from "./council.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";

const router = express.Router();

// Public: Get council members for the council page
router.get("/members", getCouncilMembers);

// Allow Wardens to retrieve all positions
router.get(
  "/positions",
  authenticate,
  authorize("WARDEN", "ADMIN"),
  getPositions,
);

// Allow Wardens and Admins to create positions
router.post(
  "/positions",
  authenticate,
  authorize("WARDEN", "ADMIN"),
  createPosition,
);

// Allow Wardens and Admins to delete positions
router.delete(
  "/positions/:id",
  authenticate,
  authorize("WARDEN", "ADMIN"),
  deletePosition,
);

// Allow Wardens and Admins to assign students to positions
router.post(
  "/assign",
  authenticate,
  authorize("WARDEN", "ADMIN"),
  assignPosition,
);

// Allow Wardens and Admins to unassign students from positions
router.post(
  "/unassign",
  authenticate,
  authorize("WARDEN", "ADMIN"),
  unassignPosition,
);

export default router;
