/***************************************************************************
 * This function is used to extract the user data from the incoming request. 
 * This checks if the JWT is valid? it calls next function by adding the 
 * user's payload(email, ID : whatever was signed with JWT by us) to the req
 * as 'currentUser' and we can further act accordingly.
 * Follow up middleware 'requireAuth' takes care of throwing an error. It 
 * extracts the 'currentUser' property and if it doesn't exist, it throws
 * an error(our custom error with 401 status)
 ****************************************************************************/


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
        // returns email and id if valid
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
