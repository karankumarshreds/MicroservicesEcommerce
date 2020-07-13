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
    // if something else goes wrong and the error is not taken care
    // by any of the custom error classes
    // So we might need to check what is that case that we might have missed
    // which is giving us this err
    console.error(err);
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