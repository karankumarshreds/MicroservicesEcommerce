import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { OrderStatus, ExpirationCompleteEvent } from '@karantickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    });
    await ticket.save();
    // make order first with status created
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asdfs',
        expiresAt: new Date(),
        ticket
    });
    await order.save();
    // create a expiration event for that order to check if its cancelled 
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, order, ticket, data, msg };
};

it(' updates the order status to cancelled', async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const orderCancelled = await Order.findById(order.id);
    expect(orderCancelled!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled()
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled()
});




