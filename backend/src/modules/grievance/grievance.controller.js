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

export const getMyGrievances = async (req, res) => {
    try {
        const userId = req.user.id;
        const grievances = await grievanceService.getMyGrievances(userId);
        res.status(200).json(grievances);
    } catch (error) {
        console.error('Error fetching my grievances:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch your grievances.' });
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

export const updateGrievance = async (req, res) => {
    try {
        const userId = req.user.id;
        const grievanceId = req.params.id;
        const data = req.body;

        if (!data.problem) {
            return res.status(400).json({ message: 'Problem description is required.' });
        }

        const updatedGrievance = await grievanceService.updateGrievance(userId, grievanceId, data);
        res.status(200).json({ message: 'Grievance updated successfully.', data: updatedGrievance });
    } catch (error) {
        console.error('Error updating grievance:', error);
        if (error.message.includes('authorized') || error.message.includes('not found')) {
             return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: error.message || 'Failed to update grievance.' });
    }
};

export const deleteGrievance = async (req, res) => {
     try {
        const userId = req.user.id;
        const grievanceId = req.params.id;

        await grievanceService.deleteGrievance(userId, grievanceId);
        res.status(200).json({ message: 'Grievance deleted successfully.' });
    } catch (error) {
        console.error('Error deleting grievance:', error);
         if (error.message.includes('authorized') || error.message.includes('not found')) {
             return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: error.message || 'Failed to delete grievance.' });
    }
};
