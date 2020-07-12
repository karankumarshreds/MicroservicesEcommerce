import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@karantickets/common';



const app = express();

// to make sure it allows and trusts traffic 
// from proxy -> nginx 
app.set('trust-proxy', true);
app.use(json());
app.use(cookieSession({
    // no need to encrypt as JWT are already signed 
    signed: false,
    // only share cookies over https (unless in test environment)
    secure: process.env.NODE_ENV != 'test' ? true : false
}));

// recieve unfiltered requests to throw custom NotFoundError
app.all('*', async () => {
    throw new NotFoundError();
});

// middleware that handles all the errors and sends reponse
app.use(errorHandler);

export { app };
