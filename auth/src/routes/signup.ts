import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup', [
    // if any errors are found by express-validator
    // the errors are attached to the request object
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim().isLength({ min: 4, max: 20 })
        .withMessage('Password length must be between 4-20 characters')
], validateRequest, async (req: Request, res: Response) => {
    // See if user already exists 
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        // another general purpose error
        throw new BadRequestError('Email in use', 400);
    };
    const user = User.build({ email, password })
    await user.save();
    // Generate JWT and store it on the session object 
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!); // ! to ignore typescript error because we are already taking care of the case 
    // where JWT_KEY is not defined in the env vars in our start() in index.ts

    // Store it on a cookie session object 
    // Cookie session library will take this object, 
    // serialize it and send it to the user's browser
    req.session = {
        jwt: userJwt
    };
    // Once the user signs up, he/she will get the cookie 
    // that would contain the JWT which will be base64 encoded
    res.status(201).send(user);
});

export { router as signupRouter };