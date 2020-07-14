import request from 'supertest';
import { app } from '../../app';
import { updateTicketRouter } from '../update';

it(('returns 404 if provided ID does not exist'), async () => {
    await request(app)
        .post('/api/tickets/5f0d80c9767f4a738338b74a')
        .set('Cookie', global.signin())
        .send({
            title: 'Title',
            price: 234
        })
        .expect(404)
});

it(('returns 401 if the user is not authenticated'), async () => {
    await request(app)
        .put('/api/tickets/5f0d80c9767f4a738338b74a')
        .send({
            title: 'Title',
            price: 234
        })
        .expect(401)
});

it(('returns 401 if user is not the owner of ticket'), async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Title',
            price: 500
        })
        .expect(201);
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Title2',
            price: 400
        })
        .expect(401);
});

it(('returns 400 if invalid price/title is provided'), async () => {
    // need to make series of requests from the same user
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 500
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 500
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: -500
        })
        .expect(400);
});

it(('All good info provided!'), async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title',
            price: 500
        })
    const updatedResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Title 2',
            price: 500
        })
        .expect(200);
    expect(response.body.title).not.toEqual(updatedResponse.body.title)
});