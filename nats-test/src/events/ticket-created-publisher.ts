import { Publisher } from './base-publisher';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';


/**
 * We could have directly used the base class to instantiate and do stuff 
 * but instead we are using that to make a structure of base class which 
 * allows us to use any TPYE of data by extending it with the sole purpose
 * of avoiding errors while passing in the real data. 
 * So here, we are extending it and altering it as per our needs by passing
 * "TicketCreatedEvent" (which has our local type of data) THEN later we're
 * calling it in the publisher file.
 */



// local
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}