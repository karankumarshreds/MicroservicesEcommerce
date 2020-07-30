import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@karantickets/common';

const setup = async () => {
    // Create an instance of a listener // natsWrapper.client is using mock function here
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a ticket 
    const ticket = Ticket.build({
        userId: 'asdf',
        title: 'concert',
        price: 500
    });
    await ticket.save();

    // Create a fake incoming data object
    const data: OrderCreatedEvent['data'] = {
        version: 0,
        status: OrderStatus.Created,
        id: mongoose.Types.ObjectId().toHexString(),
        userId: 'asdfsd',
        expiresAt: 'asdfsdf',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, msg, data, ticket };
};

it('check if the ticket has been assigned with orderId', async () => {
    const { listener, msg, data, ticket } = await setup();
    await listener.onMessage(data, msg);
    const ticketUpdated = await Ticket.findById(ticket.id);
    expect(ticketUpdated!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, msg, data, ticket } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('publishes ticket updated event after saving the orderId on the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

});