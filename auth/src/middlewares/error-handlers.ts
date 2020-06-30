import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

/**********************************************************************
 * This middleware handles all the requests and structures them in 
 * consistent way. We don't wanna send differently structured error 
 * responses to the frontend server for every other request 
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // err is the instance of RequestValidationError(subclass of CustomError)
    // err is the instance of DatabaseConnectionError(subclass of CustomError)
    if (err instanceof CustomError) {
        // serializeErrors is a method in RequestValidationError class that 
        // returns error in the standard error format
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    };
    // err is an error string coming from all the routes
    res.status(400).send({
        errors: [{ message: 'Something went wrong' }]
    });
};

/****************************************************
 * ERROR FORMAT:
 *   {
 *    errors: [ {message: string, field?: string} ]
 *   }
 ****************************************************/