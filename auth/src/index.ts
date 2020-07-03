import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handlers';
import { NotFoundError } from './errors/not-found-error';

const app = express();
// to make sure that it allows/trust traffic 
// coming from the proxy : ingrex-nginx
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    // we don't need to enable encryption on 
    // cookies as JWT are already encrypted
    signed: false,
    // cookies will only be used over https 
    secure: true
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

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

