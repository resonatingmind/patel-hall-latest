import * as eventService from "./event.service.js";

export const listEvents = async (req, res) => {
  try {
    const { category } = req.query;
    const events = await eventService.getEvents(category);
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch events." });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name || !category) {
      return res
        .status(400)
        .json({ message: "Name and Category are required." });
    }
    const newEvent = await eventService.createEvent({ name, category });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to create event." });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, secretPassword } = req.body;

    const expectedPassword = process.env.EVENT_SECRET_PASSWORD || "secret";
    if (secretPassword !== expectedPassword) {
      return res.status(403).json({ message: "Invalid secret password." });
    }

    const updatedEvent = await eventService.updateEvent(id, { name, category });
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Event not found." });
    }
    res
      .status(500)
      .json({ message: error.message || "Failed to update event." });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { secretPassword } = req.body;

    const expectedPassword = process.env.EVENT_SECRET_PASSWORD || "secret";
    if (secretPassword !== expectedPassword) {
      return res.status(403).json({ message: "Invalid secret password." });
    }

    await eventService.deleteEvent(id);
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Event not found." });
    }
    res
      .status(500)
      .json({ message: error.message || "Failed to delete event." });
  }
};

export const getEventDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch event details." });
  }
};

export const getEventPendingRequests = async (req, res) => {
  try {
    const { id } = req.params;
    const requests = await eventService.getEventParticipations(id, "PENDING");
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch pending requests." });
  }
};

export const getEventApprovedParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const requests = await eventService.getEventParticipations(id, "APPROVED");
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching approved participants:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch approved participants.",
    });
  }
};

export const updateParticipantStatus = async (req, res) => {
  try {
    const { id, participantId } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const updated = await eventService.updateParticipationStatus(
      id,
      participantId,
      status,
    );
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating participant status:", error);
    res.status(500).json({
      message: error.message || "Failed to update participant status.",
    });
  }
};

export const updateParticipantRole = async (req, res) => {
  try {
    const { id, participantId } = req.params;
    const { role } = req.body;

    if (!["MEMBER", "CAPTAIN", "VICE_CAPTAIN", "COORDINATOR"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const updated = await eventService.updateParticipationRole(
      id,
      participantId,
      role,
    );
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating participant role:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to update participant role." });
  }
};

export const addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { rollNumber, role, year } = req.body;

    if (!rollNumber) {
      return res.status(400).json({ message: "Roll number is required." });
    }

    const added = await eventService.addEventParticipant(id, {
      rollNumber,
      role,
      year,
    });
    res.status(201).json(added);
  } catch (error) {
    console.error("Error adding participant:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to add participant." });
  }
};

export const removeParticipant = async (req, res) => {
  try {
    const { id, participantId } = req.params;
    await eventService.removeEventParticipant(id, participantId);
    res.status(200).json({ message: "Participant removed successfully." });
  } catch (error) {
    console.error("Error removing participant:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to remove participant." });
  }
};

export const addResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { year, position, caption } = req.body;

    if (!year || !position) {
      return res
        .status(400)
        .json({ message: "Year and position are required." });
    }

    const result = await eventService.addEventResult(id, {
      year,
      position,
      caption,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding event result:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to add event result." });
  }
};

export const deleteResult = async (req, res) => {
  try {
    const { id, resultId } = req.params;
    await eventService.deleteEventResult(id, resultId);
    res.status(200).json({ message: "Result deleted successfully." });
  } catch (error) {
    console.error("Error deleting event result:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to delete event result." });
  }
};

export const getResultsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const results = await eventService.getEventResultsByCategory(category);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results by category:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch results." });
  }
};

export const getStandingsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const standings =
      await eventService.getOverallStandingsByCategory(category);
    res.status(200).json(standings);
  } catch (error) {
    console.error("Error fetching standings by category:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch standings." });
  }
};

export const upsertStanding = async (req, res) => {
  try {
    const { category } = req.params;
    const { year, position, totalPoints } = req.body;

    if (!year || !position) {
      return res
        .status(400)
        .json({ message: "Year and position are required." });
    }

    const standing = await eventService.upsertOverallStanding({
      category,
      year,
      position,
      totalPoints,
    });
    res.status(200).json(standing);
  } catch (error) {
    console.error("Error upserting standing:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to save standing." });
  }
};

export const deleteStanding = async (req, res) => {
  try {
    const { standingId } = req.params;
    await eventService.deleteOverallStanding(standingId);
    res.status(200).json({ message: "Standing deleted successfully." });
  } catch (error) {
    console.error("Error deleting standing:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Standing not found." });
    }
    res
      .status(500)
      .json({ message: error.message || "Failed to delete standing." });
  }
};
