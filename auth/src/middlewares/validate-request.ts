import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

export const validateRequest = (
    req: Request, res: Response, next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // this will be catched by the errorHandler middleware defined in index.ts
        // throw new Error('Invalid email or password');
        throw new RequestValidationError(errors.array());
        // we are using this only for express-validator errors 
    }
    next();
};