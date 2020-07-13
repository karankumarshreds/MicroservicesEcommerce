import request from 'supertest';
import { app } from '../../app';


it(('returns 404 if ticket not found'), async () => {
    const response = await request(app)
        .get('/api/tickets/XXX')
        .send()
    // .expect(404);
});

it(('returns ticket if ticket is found'), async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Title',
            price: 500
        })
        .expect(201)
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .expect(200);
    expect(ticketResponse.body.title).toEqual('Title');
});