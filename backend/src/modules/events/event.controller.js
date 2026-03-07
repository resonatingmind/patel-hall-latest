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

