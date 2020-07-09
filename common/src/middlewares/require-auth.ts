import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

// This will be a follow up middleware after the current-user
// From that, we get user payload attached to the req object
// If it's not present then this middleware will reject and 
// send an error code back. That's all it does!
export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    };
    next();
}