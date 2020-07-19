import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    try {
        // "ticketing" cluster ID is mentioned in the nats-depl.yaml as well
        await natsWrapper.connect('ticketing', 'abcde', 'http://nats-srv:4222');
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