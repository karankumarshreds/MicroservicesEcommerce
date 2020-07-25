import { Subjects, OrderCancelledEvent, Publisher, } from '@karantickets/common';


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
};