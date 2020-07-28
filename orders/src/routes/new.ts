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
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';



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
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            // we will not provide date object here to the expiresAt property as it 
            // expects a string. We did that because all the events are shared as JSON
            // hence strings. If we do not do that here, date object while turning itself
            // into a string, which will be a string with time zone reflecting the TIMEZONE
            // wherever it was made in. That is NOT what we want because whenever we share 
            // the timestamps across different services we need to share time stamps in a 
            // standard way and that is a UTC time stamp which will work regardless of what 
            // TIMEZONE the service receiving this event is in. Use "toISOString()" for this.
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        })

        res.status(201).send(order);
    });

export { router as createOrderRouter }