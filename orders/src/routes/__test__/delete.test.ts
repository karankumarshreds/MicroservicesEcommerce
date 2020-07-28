import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { OrderStatus } from '@karantickets/common';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';


it('marks an order as cancelled', async () => {

    // create a ticket 
    const ticket = await Ticket.build({
        title: 'concert',
        price: 500,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    const user = global.signin();
    // make a request to build an order with this ticket 
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201)
    // make a request to fetch this order 
    const order = await request(app)
        .delete(`/api/orders/${response.body.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    const updatedOrder = await Order.findById(response.body.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('emits a order cancel event', async () => {
    // create a ticket 
    const ticket = await Ticket.build({
        title: 'concert',
        price: 500,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    const user = global.signin();
    // make a request to build an order with this ticket 
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201)
    // make a request to fetch this order 
    await request(app)
        .delete(`/api/orders/${response.body.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

