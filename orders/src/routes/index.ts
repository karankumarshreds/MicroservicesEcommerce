import express, { Request, Response } from 'express';

import {
    currentUser,
    requireAuth,
    validateRequest,
    NotAuthorizedError,
    BadRequestError
} from '@karantickets/common';

const router = express.Router();

router.get('/api/orders',
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {
        res.send({});
    });

export { router as indexOrderRouter }