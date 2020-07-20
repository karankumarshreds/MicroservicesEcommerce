import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    currentUser,
    requireAuth,
    validateRequest,
    NotAuthorizedError,
    BadRequestError
} from '@karantickets/common';

const router = express.Router();

router.post('/api/orders',
    currentUser,
    requireAuth,
    [
        body('ticket').not().isEmpty()
            .withMessage('Ticket ID must be provided')
    ], validateRequest,
    async (req: Request, res: Response) => {
        res.send({});
    });

export { router as createOrderRouter }