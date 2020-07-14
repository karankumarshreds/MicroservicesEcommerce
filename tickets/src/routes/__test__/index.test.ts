import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Title',
            price: 10
        });
}

it(('Gets all the list tickets'), async () => {
    await createTicket();
    await createTicket();
    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
});