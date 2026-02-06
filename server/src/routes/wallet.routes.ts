import { Router } from 'express';
import { connectWallet, getWalletStatus, getBalance } from '../controllers/wallet.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/connect', authenticate, connectWallet);
router.get('/status', authenticate, getWalletStatus);
router.get('/balance', authenticate, getBalance);

export default router;
