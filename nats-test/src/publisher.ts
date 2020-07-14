import nats from 'node-nats-streaming';

// we will first create a client that will connect 
// with the NAT server and exchange information 
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});
stan.on('connect', () => {
    console.log('Publisher connected to NATS')
});