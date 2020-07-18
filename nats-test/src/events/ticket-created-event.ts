import { Subjects } from './subjects';

// We are coupling the subjects that we could have and the type 
// of the data that they will get beforehand so that we do not 
// run into errors while accessing or passing them due to typos

export interface TicketCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        id: string;
        title: string;
        price: number;
    }
};