import express, { Request, Response } from 'express';
import { stripe } from '../stripe';
import { body } from 'express-validator';
import {
    currentUser,
    validateRequest,
    requireAuth,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus
} from '@karantickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments',
    currentUser,
    requireAuth,
    [
        body('token').notEmpty(),
        body('orderId').notEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { token, orderId } = req.body;
        const order = await Order.findById(orderId);
        // checks 
        if (!order) throw new NotFoundError();
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        };
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Order already cancelled', 400);
        };

        // charge
        await stripe.charges.create({
            currency: 'inr',
            amount: order.price * 100, // because stripe works in least values ie (cents)
            source: token
        });

        res.status(201).send({ success: true });

    });

export { router as createChargeRouter };


