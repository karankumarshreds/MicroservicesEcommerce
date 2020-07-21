import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    currentUser,
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    OrderStatus
} from '@karantickets/common';
const router = express.Router();
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';



router.post('/api/orders',
    currentUser,
    requireAuth,
    [
        body('ticketId').not().isEmpty()
            .withMessage('Ticket ID must be provided')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;
        // Find the ticket the user is trying to order 
        // returns the id of the 
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) throw new NotFoundError();

        // Make sure that the ticket is not already reserved 
        // Check if the ticket is found in any of the orders (means it's not free)
        // this logic is defined on the ticket document in the ticket model file 
        const isReserved = await ticket.isReserved();
        if (isReserved) throw new BadRequestError('Ticket is already reserved', 400);

        // Calculate an expiration date for this order and set it to present time + 15 mins
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + (15 * 60));

        // Build the order and save to the database 
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket: ticket
        });
        await order.save();

        // Publish an event saying that an order was created

        res.status(201).send(order);
    });

export { router as createOrderRouter }