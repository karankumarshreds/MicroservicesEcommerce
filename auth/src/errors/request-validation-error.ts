/*********************************************************
 * We are extending the 'Error' class so that we can add in 
 * custom messages to one of its keys to have more control
 * over the error we want to send to the error middleware 
 * we wrote instead of sending a generic error to it
 */

/*************************************************
 * By default validationError throws an error like: 
 * [{ msg: 'Invalid email', params: 'email' }]
 * We want to be able to extract that!
 */
// importing this just to use it as a type
import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
//using CustomError(abstract clss) as an interface so that 
// we do not make any mistake and follow the exact structure
// required. For this instance, it needs to have statusCode 
// and it needs to have a method of serializeErrors as well

// Custom extended class 
export class RequestValidationError extends CustomError {
    statusCode = 400;
    // object of type ValidationError shown above 
    public errors: ValidationError[];
    // we can use this subErrorClass now with a custom message
    // though this constructor instead of just throwing
    // generic "thow new Error". 
    // Since >> const errors = validationResult(req) << returns 
    // an array which we want to send to eventual error handler middleware,
    // this constructor will accept the array of that particular type 
    constructor(errors: ValidationError[]) {
        super('Validation Error'); // passing a string for logging purposes
        this.errors = errors;
        // Only because we are extending built in class 
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    };
    // method to serialize the incoming errors to a standard form of 
    // error as { errors: [ {message: string, field?: string} ] }
    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.msg, field: err.param }
        });
    };
};

// used in signup routehandler


