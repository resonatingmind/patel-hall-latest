import express from 'express';
import { getGrievances, createGrievance } from './grievance.controller.js';
import authenticate from '../../middleware/auth.middleware.js';
import authorize from '../../middleware/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorize("ADMIN", "WARDEN", "COUNCIL"), getGrievances);
router.post('/', authenticate, authorize("STUDENT"), createGrievance);

export default router;

