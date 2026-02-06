import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Horizon } from '@stellar/stellar-sdk';
import { prisma } from '../db';

// Use same server instance as wallet controller
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

export const submitTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { signedXdr } = req.body;

        if (!signedXdr) return res.status(400).json({ error: 'Signed XDR required' });

        // Submit the transaction to Stellar network
        // The transaction is already signed by the user via Freighter
        const transactionResult = await server.submitTransaction(signedXdr);

        res.json({ success: true, hash: transactionResult.hash });
    } catch (error: any) {
        console.error('Transaction Submission Detailed Error:', JSON.stringify(error.response?.data?.extras, null, 2) || error.message);

        // Provide a helpful error message to the frontend
        let errorMessage = 'Failed to submit transaction';
        if (error.response?.data?.extras?.result_codes?.transaction) {
            errorMessage += `: ${error.response.data.extras.result_codes.transaction}`;
        }

        res.status(500).json({
            error: errorMessage,
            details: error.response?.data?.extras
        });
    }
};
