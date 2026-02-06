import { Router } from 'express';
import { submitTransaction } from '../controllers/contract.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/submit', authenticate, submitTransaction);

export default router;
