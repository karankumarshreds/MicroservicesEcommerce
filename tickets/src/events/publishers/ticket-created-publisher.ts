import { Publisher, Subjects, TicketCreatedEvent } from '@karantickets/common';


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}