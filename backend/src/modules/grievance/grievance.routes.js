import express from 'express';
import { getGrievances, createGrievance, getMyGrievances, updateGrievance, deleteGrievance } from './grievance.controller.js';
import authenticate from '../../middleware/auth.middleware.js';
import authorize from '../../middleware/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorize("ADMIN", "WARDEN", "COUNCIL"), getGrievances);
router.get('/me', authenticate, authorize("STUDENT"), getMyGrievances);
router.post('/', authenticate, authorize("STUDENT"), createGrievance);
router.put('/:id', authenticate, authorize("STUDENT"), updateGrievance);
router.delete('/:id', authenticate, authorize("STUDENT"), deleteGrievance);

export default router;
