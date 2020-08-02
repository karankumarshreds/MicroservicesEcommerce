import { Listener, OrderCreatedEvent, Subjects } from '@karantickets/common';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/order';
import { Message } from 'node-nats-streaming';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            userId: data.userId,
            version: data.version,
            status: data.status
        });
        await order.save();
        msg.ack();
    }

}