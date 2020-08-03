import { Listener, PaymentCreatedEvent, Subjects, OrderStatus } from '@karantickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    queueGroupName = queueGroupName;
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) throw new Error('Order not found');
        order.set({
            status: OrderStatus.Complete
        });
        await order.save();
        msg.ack();
    }
}
/**
 * NOTE: once the order is complete, there is no case in future that
 * it would change again, so there is no need to further publish an
 * event of "order:updated".
 */