import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@karantickets/common';


const app = express();
// to make sure that it allows/trusts traffic 
// coming from the proxy : ingrex-nginx
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    // we don't need to enable encryption on 
    // cookies as JWT are already encrypted
    signed: false,
    // cookies will sent back and forth if requested
    // via https, otherwise do not send cookies(jwt)
    // so it should be true for https (set it manually)
    secure: process.env.NODE_ENV !== 'test' ? true : false
}));
// routes 
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };