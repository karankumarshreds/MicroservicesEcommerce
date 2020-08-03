import { Publisher, PaymentCreatedEvent, Subjects } from '@karantickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
};