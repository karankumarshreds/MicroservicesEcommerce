import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';


it('fetches a order with id', async () => {

    // create a ticket 
    const ticket = await Ticket.build({
        title: 'concert',
        price: 500
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
        .get(`/api/orders/${response.body.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)
    expect(response.body.id).toEqual(order.body.id);
});



it('Cant access other users order', async () => {

    // create a ticket 
    const ticket = await Ticket.build({
        title: 'concert',
        price: 500
    });
    await ticket.save();
    const user1 = global.signin();
    const user2 = global.signin()
    // make a request to build an order with this ticket 
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({
            ticketId: ticket.id
        })
        .expect(201)
    // make a request to fetch this order 
    const order = await request(app)
        .get(`/api/orders/${response.body.id}`)
        .set('Cookie', user2)
        .send()
        .expect(401)
});