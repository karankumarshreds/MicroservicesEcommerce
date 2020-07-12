import { CustomError } from './custom-error';

// CustomError is the abstract class who's structure we 
// need to follow 
export class NotAuthorizedError extends CustomError {
    statusCode = 401;
    constructor() {
        super('Not Authorized');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    };
    serializeErrors() {
        return (
            [{ message: 'Not Authorized' }]
        );
    };
};