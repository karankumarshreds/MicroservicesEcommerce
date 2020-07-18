import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import { Subjects } from './events/subjects';

console.clear();

// we will first create a client that will connect 
// with the NAT server and exchange information 
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});
stan.on('connect', async () => {
    console.log('Publisher connected to NATS');
    const publisher = new TicketCreatedPublisher(stan, Subjects.TicketCreated);
    await publisher.publish({
        id: '123',
        title: 'concert',
        price: 20
    });
});