import { Message } from 'node-nats-streaming';
import { Subjects, TicketCreatedEvent, Listener } from '@karantickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

// Lecture #352 
// Listener set in index.ts 
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {

    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        const ticket = Ticket.build({ id, title, price });
        await ticket.save();
        msg.ack();
    };

}

/*******************************************************************************
 * @queueGroupName : multiple instances of this service need to part of same
 * queue-group so that the NAT server knows to send the event to only one in the
 * group
 *
 * @data : for type checking to tell our onMessage to process data with the given
 * type (interface === TicketCreatedEvent)
 *
 * @msg : object coming from the node-nat-streaming library which tells us about
 * the underlying data coming from the NAT server. This object has a method ACK()
 * which is only why we are using this to send ack() once we process the event.
 *
 * @onMessage : we will save a local copy of ticket everytime a new ticket is
 * created or updated. We only care about "title" & "price" as specified in the
 * local ticket model in our order service.
 */