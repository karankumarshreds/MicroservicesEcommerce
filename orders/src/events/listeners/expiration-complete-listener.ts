import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from '@karantickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        // we need to cancel order when we get expiration complete event 
        // we also need to publish order:cancelled event for ticket service
        // to unreserve the ticket from it's database 
        const order = await Order.findById(data.orderId).populate('ticket');
        if (!order) throw new Error('Order with Id not found');
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        };
        order.set({
            status: OrderStatus.Cancelled
        });
        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });
        msg.ack();
    }
}