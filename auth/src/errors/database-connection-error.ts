/*********************************************************
 * We are extending the 'Error' class so that we can add in 
 * custom messages to one of its keys to have more control
 * over the error we want to send to the error middleware 
 * we wrote instead of sending a generic error to it
 */

export class DatabaseConnectionError extends Error {
    reason = 'Error connecting to database';
    constructor() {
        super();
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
};

// NOTE: Not really required because we are just sending the 
// same error 'Error connecting to database' anywhich way 
// but doing it for the sake of consitency 

// used in signup routehandler