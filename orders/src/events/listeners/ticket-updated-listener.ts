import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@karantickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

// Listener set in index.ts 
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {

    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, price, title } = data;
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            throw new Error('Ticket not found');
        };
        ticket.set({
            title, price
        });
        await ticket.save();
        msg.ack();
    };

}
