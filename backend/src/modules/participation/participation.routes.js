import express from 'express';
import { getMyParticipations, createParticipation } from './participation.controller.js';
import authenticate from '../../middleware/auth.middleware.js';
import authorize from '../../middleware/role.middleware.js';

const router = express.Router();

router.get('/me', authenticate, authorize("STUDENT"), getMyParticipations);
router.post('/', authenticate, authorize("STUDENT"), createParticipation);

export default router;
