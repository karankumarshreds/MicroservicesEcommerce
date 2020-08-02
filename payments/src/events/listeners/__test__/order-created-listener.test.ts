import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-create-listener';
import { OrderCreatedEvent, OrderStatus } from '@karantickets/common';
import { Order } from '../../../models/order';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const data: OrderCreatedEvent['data'] = {
        version: 0,
        status: OrderStatus.Created,
        id: mongoose.Types.ObjectId().toHexString(),
        userId: 'adfadf',
        expiresAt: 'sdfsdf',
        ticket: {
            id: 'afdaa',
            price: 10
        }
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return { listener, msg, data };
};

it('replicates the order info correctly', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);
});

it('replicates the order info correctly', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

