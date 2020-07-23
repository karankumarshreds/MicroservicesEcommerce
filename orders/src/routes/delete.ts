import express, { Request, Response } from 'express';

import {
    currentUser,
    NotAuthorizedError,
    requireAuth,
    NotFoundError,
    OrderStatus
} from '@karantickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:orderId',
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.params.orderId).populate('ticket');
        if (!order) throw new NotFoundError();
        if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
        order.status = OrderStatus.Cancelled;
        await order.save()
        res.status(204).send(order);
    });

export { router as deleteOrderRouter }