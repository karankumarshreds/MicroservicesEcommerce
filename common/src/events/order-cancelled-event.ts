import { Subjects } from './subjects';

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {

        // ticket service will unreserve the mentioned id of the ticket 
        ticket: {
            id: string;
        }

        // payment service needs to know to not look for any payment for this order
        id: string;
        version: number;
    }
}