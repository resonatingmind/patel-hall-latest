import * as eventService from './event.service.js';

export const listEvents = async (req, res) => {
    try {
        const { category } = req.query;
        const events = await eventService.getEvents(category);
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch events.' });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { name, category } = req.body;
        if (!name || !category) {
            return res.status(400).json({ message: "Name and Category are required." });
        }
        const newEvent = await eventService.createEvent({ name, category });
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: error.message || "Failed to create event." });
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
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(500).json({ message: error.message || "Failed to update event." });
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
         if (error.code === 'P2025') {
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(500).json({ message: error.message || "Failed to delete event." });
    }
};
