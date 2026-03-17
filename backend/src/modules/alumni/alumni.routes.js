import express from 'express';
import { getAlumni, addAlumni, addBulkAlumni, editAlumni } from './alumni.controller.js';
import authenticate from '../../middleware/auth.middleware.js';
import authorize from '../../middleware/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorize("ADMIN", "WARDEN", "COUNCIL"), getAlumni);
router.post('/create', authenticate, authorize("ADMIN", "WARDEN", "COUNCIL"), addAlumni);
router.put('/:id', authenticate, authorize("ADMIN", "WARDEN"), editAlumni);
router.post('/create-bulk', authenticate, authorize("ADMIN"), addBulkAlumni);

export default router;
