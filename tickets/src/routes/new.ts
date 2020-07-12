import express, { Request, Response } from 'express';
import { currentUser, requireAuth } from '@karantickets/common';

const router = express.Router();

router.post(('/api/tickets'),
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {
        if (!req.signedCookies)
            res.sendStatus(200);
    });

export { router as createTicketRouter };