import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';
import { Horizon } from '@stellar/stellar-sdk';

const prisma = new PrismaClient();
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

export const connectWallet = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { publicKey } = req.body;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        if (!publicKey) return res.status(400).json({ error: 'Public key required' });

        // Check if wallet is already linked to another user
        const existingUser = await prisma.user.findUnique({
            where: { stellarAddress: publicKey },
        });

        if (existingUser && existingUser.id !== userId) {
            return res.status(400).json({ error: 'Wallet linked to another account' });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { stellarAddress: publicKey },
        });

        res.json({ success: true, stellarAddress: user.stellarAddress });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getWalletStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { stellarAddress: true },
        });

        res.json({ stellarAddress: user?.stellarAddress });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getBalance = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { stellarAddress: true },
        });

        if (!user?.stellarAddress) {
            return res.status(400).json({ error: 'No wallet connected' });
        }

        const account = await server.loadAccount(user.stellarAddress);
        // Find native balance (asset_type = 'native')
        const nativeBalance = account.balances.find((b) => b.asset_type === 'native');

        res.json({
            balance: nativeBalance?.balance || '0',
            network: 'Testnet'
        });
    } catch (error: any) {
        // If account not found (unfunded), return 0
        if (error.response?.status === 404) {
            return res.json({ balance: '0', network: 'Testnet' });
        }
        res.status(500).json({ error: 'Failed to fetch balance' });
    }
};
