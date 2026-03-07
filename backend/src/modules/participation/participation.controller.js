import * as participationService from './participation.service.js';

export const getMyParticipations = async (req, res) => {
    try {
        const userId = req.user.id;
        const participations = await participationService.getMyParticipations(userId);
        res.status(200).json(participations);
    } catch (error) {
        console.error('Error fetching my participations:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch your participations.' });
    }
};

export const createParticipation = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = req.body;

        if (!data.eventId) {
            return res.status(400).json({ message: 'Event is required.' });
        }

        const newParticipation = await participationService.createParticipation(userId, data);
        res.status(201).json({ message: 'Participation submitted successfully.', data: newParticipation });
    } catch (error) {
        console.error('Error creating participation log:', error);
        res.status(500).json({ message: error.message || 'Failed to submit participation.' });
    }
};
