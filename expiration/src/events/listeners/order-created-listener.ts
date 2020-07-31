import { natsWrapper } from '../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@karantickets/common';
import { queueGroupName } from './queueGroupName';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    }
};