import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any;
};

export class Publisher<T extends Event> {
    private client: Stan;
    subject: T['subject'];
    constructor(client: Stan, subject: T['subject']) {
        this.client = client;
        this.subject = subject;
    };
    publish(data: T['data']): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) return reject(err);
                console.log(`Event published w/ subject: ${this.subject}`);
                resolve();
            });
        })

    };
};