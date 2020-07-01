import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
// import { DatabaseConnectionError } from '../errors/database-connection-error';
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
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // this will be catched by the errorHandler middleware defined in index.ts
        // throw new Error('Invalid email or password');
        throw new RequestValidationError(errors.array()); // we are using this only for express-validator errors 
    };
    // See if user already exists 
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        // another general purpose error
        throw new BadRequestError('Email in use', 400);
    };
    const user = User.build({ email, password })
    await user.save();
    res.status(201).send(user);
});

export { router as signupRouter };