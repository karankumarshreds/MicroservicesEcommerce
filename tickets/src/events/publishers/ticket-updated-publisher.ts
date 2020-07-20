import { Publisher, Subjects, TicketUpdatedEvent } from '@karantickets/common';


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}