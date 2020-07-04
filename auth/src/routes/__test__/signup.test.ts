// used to fake a request (like jmeter)
import request from 'supertest';
import { app } from '../../app';

it(('returns a 201 on successful signup'), async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it(('returns a 400 with an invalid email'), async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'password'
        })
        .expect(400);
});

it(('returns a 400 with an invalid password'), async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'p'
        })
        .expect(400);
});

it(('returns a 400 with missing email and password'), async () => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
});

it(('disallows duplicate emails'), async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
});

it(('sets a cookie after a successful signup'), async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    // To check if user is getting a cookie attached to header
    // as 'Set-Cookie' which includes the JWT for the user 
    expect(response.get('Set-Cookie')).toBeDefined();
});