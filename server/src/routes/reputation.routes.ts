import { Router } from 'express';
import { performAction, getScore } from '../controllers/reputation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/action', authenticate, performAction);
router.get('/score', authenticate, getScore);

export default router;
