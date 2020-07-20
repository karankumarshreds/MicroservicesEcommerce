import express, { Request, Response } from 'express';

import {
    currentUser,
    validateRequest,
    NotAuthorizedError,
    BadRequestError
} from '@karantickets/common';

const router = express.Router();

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {
    res.send({});
});

export { router as showOrderRouter }