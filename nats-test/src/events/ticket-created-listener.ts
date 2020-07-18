import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
// since the base class expects us to pass the type of event
// to avoid typose, we will pass in the TicketCreatedEventType
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export // our class for local work 
    class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service';
    // specifying the type of data we will get so that we don't
    // accidentally try and access the data properties which do
    // not exist : console.log(data.full_name)
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data', data);
        // console.log(data.cost)
        console.log(data.title);
        console.log(data)
        msg.ack();
    }
}