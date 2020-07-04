import request from 'supertest';
import { app } from '../../app';

it(('returns 400 if email does not exist'), async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'random@random.com',
            password: 'password'
        })
        .expect(400)
});

it(('returns 400 if incorrect password is applied'), async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'valid@valid.com',
            password: 'password'
        })
        .expect(201)

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'valid@valid.com',
            password: 'invalid_password'
        })
        .expect(400)
});

it(('returns with cookie if valid credentials'), async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'valid@valid.com',
            password: 'password'
        })
        .expect(201)
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'valid@valid.com',
            password: 'password'
        })
        .expect(200)
    expect(response.get('Set-Cookie')).toBeDefined();
})