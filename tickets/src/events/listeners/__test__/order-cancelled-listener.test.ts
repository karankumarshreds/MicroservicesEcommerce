import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent } from "@karantickets/common";
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from '../../../models/ticket';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        title: 'concert',
        price: 200,
        userId: '12345',
    });
    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        ticket: {
            id: ticket.id
        },
        id: orderId,
        version: 0
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return { msg, data, ticket, orderId, listener };
};

it('Updates the ticket, publishes an event nd acks the msg', async () => {
    const { msg, data, ticket, orderId, listener } = await setup();
    // send fake order cancelling event 
    await listener.onMessage(data, msg);
    // check if the orderId has been nullified 
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

})
