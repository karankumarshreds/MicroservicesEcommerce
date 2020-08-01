import { natsWrapper } from '../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@karantickets/common';
import { queueGroupName } from './queueGroupName';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        // enqueue the job for bull with data and delay 
        await expirationQueue.add({
            orderId: data.id
        },
            {
                // amount of time to wait until the job is processed 
                // (job logic to publish event written in expiration-queue)
                delay: delay
            }
        );
        msg.ack();
    }
};