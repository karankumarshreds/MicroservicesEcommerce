import { Request, Response, NextFunction } from 'express';

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
    // err is an error string coming from all the routes
    res.status(400).send({
        message: err.message
    });
};