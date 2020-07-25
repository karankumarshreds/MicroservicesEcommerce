import { Publisher, Subjects, OrderCreatedEvent } from '@karantickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
};