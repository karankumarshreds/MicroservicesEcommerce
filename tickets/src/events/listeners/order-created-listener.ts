import { Listener, OrderCreatedEvent, Subjects } from '@karantickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

/**
 * // Lecture #381
 * This listener will listen for order:created from order service and
 * immediately reserve the ticket so that the user cannot buy it bcs
 * it is being processed by some other user.
 */

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // find the ticket associated with incoming order 
        const ticket = await Ticket.findById(data.ticket.id);
        // throw an error if ticket is not found 
        if (!ticket) throw new Error('Ticket not found');
        //
        ticket.set({
            orderId: data.id
        });
        await ticket.save()
        // we also need to update the run ticket updated publisher to tell
        // the other services(specifically ticket service) to change the new version 
        // and add in the order id because we want all the services to be in the sync
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        });
        msg.ack();
    }
};