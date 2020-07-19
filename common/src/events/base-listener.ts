import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;
    protected client: Stan;
    protected ackWait = 5 * 1000;
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

