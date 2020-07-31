import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { body } from 'express-validator';
import {
    validateRequest,
    NotFoundError,
    NotAuthorizedError,
    requireAuth,
    currentUser,
    BadRequestError
} from '@karantickets/common';

import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id',
    currentUser,
    requireAuth,
    [
        body('title').not().isEmpty()
            .withMessage('Title cannot be empty'),
        body('price').isFloat({ gt: 0 })
            .withMessage('Price needs to be greater than 0')

    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) throw new NotFoundError();
        if (ticket.orderId) throw new BadRequestError('Cannot edit a reserved Ticket', 400);
        if (ticket!.userId !== req.currentUser!.id) throw new NotAuthorizedError();

        ticket.set({
            title: req.body.title,
            price: req.body.price
        });
        await ticket.save();
        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        });
        res.send(ticket);
    });

export { router as updateTicketRouter };