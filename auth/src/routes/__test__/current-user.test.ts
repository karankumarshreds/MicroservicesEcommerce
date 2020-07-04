import request from 'supertest';
import { app } from '../../app';
import { signupMiddleware } from '../../test/tests-middleware';

it(('returns current user details'), async () => {
    const cookies = await signupMiddleware();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookies)
        .send()
        .expect(200)
    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it(('returns null if not signed in'), async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200)

    expect(response.body.currentUser).toEqual(null);
});
