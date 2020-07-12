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
            signin(): Promise<string[]>
        }
    }
};

global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);
    const cookie = response.get('Set-Cookie');
    return cookie;
};