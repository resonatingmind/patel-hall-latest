import * as grievanceService from './grievance.service.js';

export const getGrievances = async (req, res) => {
    try {
        const grievances = await grievanceService.getAllGrievances();
        res.status(200).json(grievances);
    } catch (error) {
        console.error('Error fetching grievances:', error);
        res.status(500).json({ message: 'Failed to fetch grievances.' });
    }
};

export const createGrievance = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from Supabase user object via authenticate middleware
        const data = req.body;

        
        if (!data.problem) {
            return res.status(400).json({ message: 'Problem description is required.' });
        }

        const newGrievance = await grievanceService.createGrievance(userId, data);
        res.status(201).json({ message: 'Grievance submitted successfully.', data: newGrievance });
    } catch (error) {
        console.error('Error creating grievance:', error);
        res.status(500).json({ message: error.message || 'Failed to submit grievance.' });
    }
};

