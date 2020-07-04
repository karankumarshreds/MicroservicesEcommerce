import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
};
// this is how we get into an existing inbuilt 
// type definition and make modifications to it 
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
};

// middleware to extract information of the logged in user
export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session || !req.session.jwt) {
        return next();
    };
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        /** 
         * In normal JS we would have simply added a property to req and 
         * passed it to the further functions : req.currentUser = payload 
         * This way, further functions would have access to whos logged in
         * BUT, in TS, we cannot add a new property to req object as TS has
         * a type definition file for express that defines the req object 
         * Hence, we will augment the req type definition.
         * 
         * We know we will get back "email" and "id" as payload in return
         * so we will first make an interface with those properties 
         */
        req.currentUser = payload;
    } catch (err) {
        next();
    }
    next();
};