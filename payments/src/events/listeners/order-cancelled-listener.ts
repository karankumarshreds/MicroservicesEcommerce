import { Listener, OrderCancelledEvent, Subjects, OrderStatus } from '@karantickets/common';
import { queueGroupName } from './queueGroupName';
import { Order } from '../../models/order';
import { Message } from 'node-nats-streaming';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });
        if (!order) throw new Error('Order not found');
        order.set({
            status: OrderStatus.Cancelled
        });
        msg.ack();
    }
}