import { prisma } from '../db';

// This service essentially abstracts the "storage" of reputation.
// In Phase 2, this file can be modified to write to the blockchain instead of the SQL DB.
export class ReputationService {
    static async updateScore(userId: number, points: number): Promise<number> {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                reputationScore: {
                    increment: points,
                },
            },
        });
        return user.reputationScore;
    }

    static async getScore(userId: number): Promise<number> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { reputationScore: true },
        });
        return user?.reputationScore || 0;
    }
}
