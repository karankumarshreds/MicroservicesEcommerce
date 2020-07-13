import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it(('has post route handler at /api/tickets'), async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    expect(response.status).not.toEqual(404);
});

it(('can only be accessed if signed in'), async () => {
    return request(app)
        .post('/api/tickets')
        .send({})
        .expect(401)
});

it(('returns a status other than 401 if user is signed in'), async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin()) // function defined in setup.ts
        .send({});
    expect(response.status).not.toEqual(401);
});


it(('returns error if invalid title provided'), async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 100
        })
        .expect(400)
});

it(('returns error if invalid price provided'), async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Title',
            price: -10
        })
        .expect(400)
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Title',
        })
        .expect(400)
});

it(('creates a ticket with valid inputs'), async () => {
    //initialy 0 ticket
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Title',
            price: 500
        })
        .expect(201)
    tickets = await Ticket.find({})
    expect(tickets.length).not.toEqual(0);
});