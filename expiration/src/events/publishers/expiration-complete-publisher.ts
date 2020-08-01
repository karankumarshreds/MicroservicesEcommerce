import { Publisher, Subjects, ExpirationCompleteEvent } from '@karantickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}