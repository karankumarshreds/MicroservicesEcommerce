import nats, { Stan } from 'node-nats-streaming';

/**
 * We will make a client inside of this class and assign it as a property
 * to the class. Then will share the instance with the index.ts & new.ts.
 * We will initialize the client from inside the index.ts and access the 
 * same initialized client from the new.ts.
 * This way we will have to initialize it globally once and then we can 
 * use it anywhere inside of our code.
 * EXACTLY LIKE MONGOOSE WORK!
 */
class NatsWrapper {
    private _client?: Stan;
    // throw error if someone accesses it when it's not defined (defined @ ##1)
    // using TS get function
    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client before connecting');
        };
        return this._client; // this WILL be intiated ! accessed in new.ts
    };
    connect(clusterId: string, clientId: string, url: string) {
        // defining client ##1
        this._client = nats.connect(clusterId, clientId, { url });
        // to make client.on('connect') an async opertaion like mongoose
        // used in index.ts
        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            });
            this.client.on('error', (err) => {
                reject(err);
            })
        });
    };
}
// exporting an instance of this directly
export const natsWrapper = new NatsWrapper();