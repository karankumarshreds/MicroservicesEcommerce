import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT must be defined');
    }
    try {
        // mongodb will automatically create a DB for us named 'auth'
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Auth connected to mongodb...')
    } catch (err) {
        console.error(err);
    }
    // if it successfully connects to the database 
    app.listen(3000, () => {
        console.log('Auth listening on 3000...')
    });
};

start();

