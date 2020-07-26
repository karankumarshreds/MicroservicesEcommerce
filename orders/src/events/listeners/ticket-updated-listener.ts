import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@karantickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

// Listener set in index.ts 
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {

    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, price, title, version } = data;
        // Lecture 368
        const ticket = await Ticket.findByEvent({ id, version });
        if (!ticket) {
            throw new Error('Ticket not found');
        };
        ticket.set({
            title, price
        });
        // saving will increment the version automatically. 
        // We don't need to add version property in the above step 
        await ticket.save();
        msg.ack();
    };

}
