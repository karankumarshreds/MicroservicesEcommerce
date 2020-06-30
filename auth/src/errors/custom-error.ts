// Goal of writing this abstract class is that the inheritted subclasses
// have the same structure, just as we do using interfaces in typescript 
export abstract class CustomError extends Error {
    // it will only let you extend this class only if the subclass 
    // trying to extend has following structure 
    abstract statusCode: number;
    constructor(message: string) {
        super(message); // telling subclass to add some string as well for logging purposes
        // Only because we are extending built in class 
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    // subclass must have method of this structure
    abstract serializeErrors(): { message: string, field?: string }[]

};
