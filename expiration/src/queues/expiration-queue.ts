import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

// Lecture #401

// interface to tell what type of data will the job object handle 
interface Payload {
    orderId: string;
};

// this will help us publish a job and process the job later 
// arg #1 is like a channel/bucket inside the redis server  
// inside of which the publish job will be saved 
// arg #2 to tell the Queue where we will be saving the jobs 
// in our case it is redis 
// Payload (optional), just to tell the Queue what kind of 
// data will be flowing through to redis and back 
const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        // mentioned in the expiration deployment.yaml
        host: process.env.REDIS_HOST
    }
});


// when redis sends us back the data after 15 mins 
// we start to process the job(this is not the data) 
// we will publish an event for order service
// job is something like msg in node-nat-streaming 
// which contains data and other methods with it 
expirationQueue.process(async (job) => {
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    });
    console.log('Expiration event published for order ID =  ', job.data.orderId);
});

export { expirationQueue };