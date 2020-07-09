/*********************************************************
 * We are extending the 'Error' class so that we can add in 
 * custom messages to one of its keys to have more control
 * over the error we want to send to the error middleware 
 * we wrote instead of sending a generic error to it
 */
import { CustomError } from './custom-error';

//using CustomError(abstract clss) as an interface so that 
// we do not make any mistake and follow the exact structure
// required. For this instance, it needs to have statusCode 
// and it needs to have a method of serializeErrors as well 
export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = 'Error connecting to database';
    constructor() {
        super('Database connection error'); // passing a string for logging purposes
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    // we are adding this method to structure the error in 
    // a standard form so that it can be used by the error 
    // handling middleware to send it to the client 
    // SO: this is method to serialize the incoming errors to a standard form of 
    // error as { errors: [ {message: string, field?: string} ] }
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