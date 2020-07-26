import { Subjects } from './subjects';
import { OrderStatus } from './types/order-status';

/**
 * This will be published whenever an order is created 
 */

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {

        version: number;

        // default status of order whenever it is created 
        status: OrderStatus;

        // order ID 
        id: string;

        // needed by the payment service to accept the payment from this user 
        userId: string;

        // expiration service needs to know the expires at time for the order 
        expiresAt: string;

        // needed by tickets service to lock the ability to lock the editing of the ticket
        // payment service also needs to know the price of this ticket 
        ticket: {
            id: string;
            price: number;
        }
    }
};