import * as alumniService from './alumni.service.js';

export const getAlumni = async (req, res) => {
    try {
        const alumni = await alumniService.getAllAlumni();
        res.status(200).json(alumni);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        res.status(500).json({ message: 'Failed to fetch alumni.' });
    }
};

export const addAlumni = async (req, res) => {
    try {
        const data = req.body;
        const newAlum = await alumniService.createAlumni(data);
        res.status(201).json({ message: 'Alumnus added successfully.', data: newAlum });
    } catch (error) {
        console.error('Error creating alumni:', error);
        // Using 400 for validation errors thrown by the service
        res.status(400).json({ message: error.message || 'Failed to add alumnus.' });
    }
};

export const addBulkAlumni = async (req, res) => {
    try {
        const alumniList = req.body.alumni || req.body; 
        const result = await alumniService.createBulkAlumni(alumniList);
        res.status(201).json({ message: `${result.count} alumni added successfully.`, count: result.count });
    } catch (error) {
        console.error('Error in bulk creating alumni:', error);
        res.status(400).json({ message: error.message || 'Failed to add alumni in bulk.' });
    }
};
