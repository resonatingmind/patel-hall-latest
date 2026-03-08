import express from "express";
import * as eventController from "./event.controller.js";
import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/role.middleware.js";

const router = express.Router();

// Public routes for hall culture pages (no auth required)
router.get("/category/:category/events", eventController.getEventsByCategory);
router.get("/category/:category/results", eventController.getResultsByCategory);
router.get(
  "/category/:category/standings",
  eventController.getStandingsByCategory,
);
router.get(
  "/category/:category/leadership",
  eventController.getLeadershipByCategory,
);

// Fetch events (Students to log participation, Council to manage)
router.get(
  "/",
  authenticate,
  authorize("STUDENT", "COUNCIL", "ADMIN"),
  eventController.listEvents,
);

// Council/Admin routes for managing events
router.post(
  "/",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.createEvent,
);
router.put(
  "/:id",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.updateEvent,
);
router.delete(
  "/:id",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.deleteEvent,
);

// Event Details, Participations, and Results
router.get(
  "/:id",
  authenticate,
  authorize("STUDENT", "COUNCIL", "ADMIN"),
  eventController.getEventDetails,
);
router.get(
  "/:id/pending",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.getEventPendingRequests,
);
router.get(
  "/:id/approved",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.getEventApprovedParticipants,
);
router.patch(
  "/:id/participants/:participantId",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.updateParticipantStatus,
);
router.put(
  "/:id/participants/:participantId/role",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.updateParticipantRole,
);
router.post(
  "/:id/participants",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.addParticipant,
);
router.delete(
  "/:id/participants/:participantId",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.removeParticipant,
);
router.post(
  "/:id/results",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.addResult,
);
router.delete(
  "/:id/results/:resultId",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.deleteResult,
);

// Overall Standings management (Council/Admin)
router.post(
  "/category/:category/standings",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.upsertStanding,
);
router.delete(
  "/standings/:standingId",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.deleteStanding,
);

// Leadership Team management (Council/Admin)
router.post(
  "/category/:category/leadership",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.upsertLeadershipMember,
);
router.delete(
  "/leadership/:memberId",
  authenticate,
  authorize("COUNCIL", "ADMIN"),
  eventController.deleteLeadershipMember,
);

export default router;
