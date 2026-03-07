import express from 'express';
import { listEvents, createEvent, updateEvent, deleteEvent } from './event.controller.js';
import authenticate from '../../middleware/auth.middleware.js';
import authorize from '../../middleware/role.middleware.js';

const router = express.Router();

// Fetch events (Students to log participation, Council to manage)
router.get('/', authenticate, authorize("STUDENT", "COUNCIL", "ADMIN"), listEvents);

// Council/Admin routes for managing events
router.post('/', authenticate, authorize("COUNCIL", "ADMIN"), createEvent);
router.put('/:id', authenticate, authorize("COUNCIL", "ADMIN"), updateEvent);
router.delete('/:id', authenticate, authorize("COUNCIL", "ADMIN"), deleteEvent);

export default router;

