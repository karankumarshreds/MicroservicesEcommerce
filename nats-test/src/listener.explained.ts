import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// # arg1 : cluster ID 
// using random ID because we are running multiple instances
// and each instance of needs to have a unique client id
// # arg2 : client ID
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');
    // to tell stan to consider this as closed
    // & NOT wait for some amount of time for confirmation 
    // ##1
    stan.on('close', () => {
        console.log('NATS connection closed')
    });
    new TicketCreatedListener(stan).listen();
    /** That's it, the queue group will be created linked to "ticket:created channel" 
     *  This will make sure that no matter how many instances of this listener service 
     *  are created, the event will be thrown to any one random service inside this 
     *  'listener-service-queue=roup'.
     */
    // setting options
    // const options = stan
    //     .subscriptionOptions()
    //     .setManualAckMode(true) // to send an ack to the NATS server telling we successfully recieved the event
    //     // ^ This gives us an option to send ack whenever WE want eg: after successully querying/saving data to 
    //     // the DB. If set to false, node-nats library will send ack automatically even if there is an further 
    //     // with the data processing. So now WE HAVE TO manually acknowledge the same otherwise (msg.ack()) 
    //     // NAT server will keep sending the event alternatively to  replicas of this service until it recieves and ack 
    //     .setDeliverAllAvailable() // to get all the passed events when restarted : USED IN CASE OF NEW SERVICES !
    //     // Runs only for the very first time for the service
    //     .setDurableName('ticketing'); // NAT server will create a durable-subscription for this service with the name 
    // // provided. It will keep the record of all the events passed out && missed by this service under the name 
    // // 'ticketing'. And if this service comes up again, it will send back all the missed out events.

    // // specify the name of the subject to listen to create a subscription to retrieve the data/msg
    // // # arg2 : name of the queue group that I wanna join This can be any name (related to the service)
    // const subscription = stan.subscribe(
    //     'ticket:created',
    //     'listener-service-queue-group',
    //     options
    // );
    // retrieving for message(data) 
    // subscription.on('message', (msg: Message) => {
    //     const data = msg.getData();
    //     if (typeof data === 'string') {
    //         console.log(`recieved event #${msg.getSequence()} 
    //         with data: ${data}`);
    //     };
    //     // manual ack
    //     msg.ack();
    // });

});

// or close if manually interrupted or terminated
// & this runs ##1
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

// stan.close() informs the NAT to not send any more events


// Recieves a NAT client instance
abstract class Listener {
    /**
     * Name of the channel this listener is going to listen to 
     */
    abstract subject: string;
    /**
     * Name of the queue group name this listener will join 
     */
    abstract queueGroupName: string;
    /**
     * Function to run all your queries when a message is recieved 
     */
    abstract onMessage(data: any, msg: Message): void;
    /**
     * Pre initialized NATS client instance
     */
    private client: Stan;
    /**
     * Number of seconds this listener has to ack a message
     */
    protected ackWait = 5 * 1000;
    constructor(client: Stan) {
        this.client = client;
    };
    /**
     * Default subscription options
     */
    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName)
    };
    /**
     * Method to set up the main subscription
     */
    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );
        subscription.on('message', (msg: Message) => {
            console.log(
                `Message recieved: ${this.subject} / ${this.queueGroupName}`
            );
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    };
    /**
     * Helper function to parse a message  
     */
    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8')) // incase it's buffer
    };
};


class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'payments-service';
    onMessage(data: any, msg: Message) {
        console.log('Event data', data);
        msg.ack();
    };

}