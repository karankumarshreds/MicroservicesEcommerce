import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

/************************************************************
 * MongoMemoryServer is going to run an instance of mongodb
 * in memory which is going to allow us to run multiple
 * different test suites in our project without all services
 * trying to reach out to the same copy of mongo
 */
let mongo: any;
// This hook runs before all the tests 
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
});

// This hook runs before each of our tests 
beforeEach(async () => {
    // Delete all old tasks running in the mongodb instance 
    // so that it gets free for each tests 
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    };
});

// After we finish all the tests, we will stop the mongodb 
// server and disconnect mongoose from it 
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

// refactoring global to accept custom function to be used by all the tests
declare global {
    namespace NodeJS {
        interface Global {
            signin(): string[];
        }
    }
};
/** Since we cannot have access of auth service, we will make custom cookies 
 * Basically we are replicating the flow of signing in.
 */
import jwt from 'jsonwebtoken';

global.signin = () => {
    // build a JWT payload { id, email }
    const payload = {
        id: '12345678',
        email: 'test@test.com'
    };

    // create JWT 
    const token = jwt.sign(payload, process.env.JWT_KEY!); // key defined above in beforeAll()

    // build session object { jwt: MY_JWT }
    const session = { jwt: token };

    // turn that session into JSON 
    const sessionJSON = JSON.stringify(session);

    // take json and encode it as base64
    // this gets saved in the browser with key of express:sess
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string that with key as express:sess
    // (bcs that's what the browser does after user is signed in)
    return [`express:sess=${base64}`];
};
