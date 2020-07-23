import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import {
    currentUser,
    requireAuth,
    validateRequest,
    BadRequestError
} from '@karantickets/common';

const router = express.Router();

router.get('/api/orders',
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {
        const orders = await Order.find({
            userId: req.currentUser!.id
        }).populate('ticket') // get associated ticket as well
        res.send(orders);
    });

export { router as indexOrderRouter }