import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '@karantickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';

// Lecture 373
const setup = async () => {

    // create an instance of listener 
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake { data } 
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'concert',
        price: 10,
        userId: mongoose.Types.ObjectId().toHexString()
    }

    // create a fake { message }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};


it('creates and saves a ticket', async () => {

    const { listener, data, msg } = await setup();

    // call onMessage() with data and message 
    await listener.onMessage(data, msg);

    // write assertions to make sure the ticket was created 
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);

});

it('acks the message', async () => {

    // call onMessage() with data and message 
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    // write assertions to make sure ack funtion is called 
    expect(msg.ack).toHaveBeenCalled();

});

