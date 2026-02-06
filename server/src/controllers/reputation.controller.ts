import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ReputationService } from '../services/reputation.service';

const ACTIONS = {
    'daily-check-in': 1,
    'complete-task': 5,
};

export const performAction = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { action } = req.body;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        if (!action || !ACTIONS[action as keyof typeof ACTIONS]) {
            return res.status(400).json({ error: 'Invalid action' });
        }

        const points = ACTIONS[action as keyof typeof ACTIONS];
        const newScore = await ReputationService.updateScore(userId, points);

        res.json({ success: true, addedPoints: points, totalScore: newScore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getScore = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const score = await ReputationService.getScore(userId);
        res.json({ score });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
