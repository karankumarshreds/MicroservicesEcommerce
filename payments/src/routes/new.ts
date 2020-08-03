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
import { Payment } from '../models/payment';

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
        const charge = await stripe.charges.create({
            currency: 'inr',
            amount: order.price * 100, // because stripe works in least values ie (cents)
            source: token
        });

        // save the payments 
        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        });
        // await payment.save();

        res.status(201).send({ success: true });

    });

export { router as createChargeRouter };

/**
 * If sometime in the future you need to add a feature for the user to see
 * list of all the payments, you can make use of the stripeId saved in the
 * payments DB, create a new route handler which makes 'retrieve charge'
 * with a <stripeId> to the stripe API.
 */


