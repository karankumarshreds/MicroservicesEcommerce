/*********************************************************
 * We are extending the 'Error' class so that we can add in 
 * custom messages to one of its keys to have more control
 * over the error we want to send to the error middleware 
 * we wrote instead of sending a generic error to it
 */

export class DatabaseConnectionError extends Error {
    statusCode = 500;
    reason = 'Error connecting to database';
    constructor() {
        super();
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    // we are adding this method to structure the error in 
    // a standard form so that it can be used by the error 
    // handling middleware to send it to the client 
    serializeErrors() {
        return [
            {
                message: this.reason
            }
        ]
    }
};

// NOTE: Not really required because we are just sending the 
// same error 'Error connecting to database' anywhich way 
// but doing it for the sake of consitency 

// used in signup routehandler