import express from 'express';
import { listEvents } from './event.controller.js';
import authenticate from '../../middleware/auth.middleware.js';
import authorize from '../../middleware/role.middleware.js';

const router = express.Router();

// Students can fetch events to log their participation
router.get('/', authenticate, authorize("STUDENT"), listEvents);

export default router;

