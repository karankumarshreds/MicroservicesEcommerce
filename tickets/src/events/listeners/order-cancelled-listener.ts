import { Listener, OrderCancelledEvent, Subjects } from '@karantickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
/**
 * Goal of this listener is to remove the orderId property from the
 * ticket and save the ticket and again publish the saved ticket so
 * that the other services can update the ticket version as well
 */

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) throw new Error('Ticket not found');
        ticket.set({
            orderId: undefined
        });
        await ticket.save();

        // notify other services about change and new version number 
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        });

        msg.ack();

    };
}