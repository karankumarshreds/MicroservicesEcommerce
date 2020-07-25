import express, { Request, Response } from 'express';

import {
    currentUser,
    NotAuthorizedError,
    requireAuth,
    NotFoundError,
    OrderStatus
} from '@karantickets/common';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

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

        // publish an event telling order was cancelled 
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id
            }
        });

        res.status(204).send(order);
    });

export { router as deleteOrderRouter }