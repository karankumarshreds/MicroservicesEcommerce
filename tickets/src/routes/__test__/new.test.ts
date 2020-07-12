import request from 'supertest';
import { app } from '../../app';

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
    console.log(response.status, "%%%%%%%%%%%%%%%%%")
    expect(response.status).not.toEqual(401);
});


it(('returns error if invalid title provided'), async () => {
    // await request(app)
});

it(('returns error if invalid price provided'), async () => {
    // await request(app)
});

it(('creates a ticket with valid inputs'), async () => {
    // await request(app)
});