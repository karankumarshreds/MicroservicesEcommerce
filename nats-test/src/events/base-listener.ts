import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

// for an object to be considered as an event 
// it must have the following properties 
interface Event {
    subject: Subjects;
    data: any;
}

// custom module
// T extends Event : whenever we will extend this base class
// we will have to provide/pass a custom type to it 
export abstract class Listener<T extends Event> {
    abstract subject: T['subject']; // name of the desired channel
    abstract queueGroupName: string; // name of queue group to join
    abstract onMessage(data: T['data'], msg: Message): void; // business logic
    private client: Stan;
    protected ackWait = 5 * 1000; // time for ack 
    constructor(client: Stan) {
        this.client = client;
    };
    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName)
    };

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );
        subscription.on('message', (msg: Message) => {
            console.log(
                `Message recieved from ${this.subject} / ${this.queueGroupName}`
            );
            const data = msg.getData();
            const parsedData = typeof data === 'string'
                ? JSON.parse(data)
                : JSON.parse(data.toString('utf-8'));
            this.onMessage(parsedData, msg);
        });
    }
};

