import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
    public statusCode: number;
    public error: string;
    constructor(error: string, statusCode: number) {
        super('Bad request error');
        this.error = error;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [{
            message: this.error
        }];
    }
}