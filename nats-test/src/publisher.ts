import nats from 'node-nats-streaming';

console.clear();

// we will first create a client that will connect 
// with the NAT server and exchange information 
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});
stan.on('connect', () => {
    console.log('Publisher connected to NATS');
    // Can only publish json or string type
    const data = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    });
    // # arg1 : Subject name 
    // # arg2 : Data 
    // # arg3 : Optional
    stan.publish('ticket:created', data, () => {
        console.log('Event published');
    });
});