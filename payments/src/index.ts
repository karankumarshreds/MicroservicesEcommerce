import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-create-listener';


const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    try {
        // arg #1 : Cluster ID ; arg #2 unique client ID for each instance of this ticketing service 
        /**
         * Hence it would be really good if we used the same name as of the name of the "pod" because
         * they will always be unique and it will be easy for us to log as well in case required
         * So this is handled in the deployment file 
         */
        // "ticketing" cluster ID is mentioned in the nats-depl.yaml as well (while instantiating NATS!!)
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed by user')
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        // listeners 
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Auth connected to mongodb...')
    } catch (err) {
        console.error(err);
    };

    // if it successfully connects to the database 
    app.listen(3000, () => {
        console.log('Tickets listening on 3000...')
    });
};

start();