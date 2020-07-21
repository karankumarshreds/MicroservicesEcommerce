import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('Returns an error if ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId
        })
        .expect(404)
});
it('Returns an error if ticket is reserved', async () => {

});
it('Reserves a ticket by creating order', async () => {

});