import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import reputationRoutes from './routes/reputation.routes';
import walletRoutes from './routes/wallet.routes';
import contractRoutes from './routes/contract.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/reputation', userRoutes); // Requirement asks for /reputation/action, /reputation/score which fits user routes or separate reputation routes. 
// For simplicity I'll map /reputation to the user controller logic or a reputation controller. 
// Let's stick to the prompt's suggested endpoints directly.
// POST /auth/register
// POST /auth/login
// GET /user/me
// POST /reputation/action
// GET /reputation/score

// So:
app.use('/user', userRoutes);
app.use('/reputation', reputationRoutes);
app.use('/wallet', walletRoutes);
app.use('/contract', contractRoutes);

export default app;
