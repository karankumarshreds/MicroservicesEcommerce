import { Listener, OrderCreatedEvent, Subjects } from '@karantickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

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
        msg.ack();
    }
};