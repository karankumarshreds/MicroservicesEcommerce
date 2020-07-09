import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
    statusCode = 404;
    constructor() {
        super('Page not found');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    };
    serializeErrors() {
        return [{ message: "Page not found" }]
    }
}

// instance of this class can be used anywhere to 
// throw a new error with message: Page not found 