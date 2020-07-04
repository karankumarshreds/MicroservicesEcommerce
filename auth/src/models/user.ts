import mongoose from 'mongoose';
import { Password } from '../services/password';
// An interface that describes the properties 
// that are required to pass to create a new User 
interface UserAttrs {
    email: string;
    password: string;
};

// An interface that tells User model that it will 
// contain a build function that we created for it (only needed in TS)
interface UserModel extends mongoose.Model<UserDoc> {
    // telling it should have a method build 
    build(attrs: UserAttrs): UserDoc;
};

// An interface that describe the properties a single 
// use has/can have 
interface UserDoc extends mongoose.Document {
    email: 'string';
    password: 'string';
};

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { // Customization of how the objects will be saved as JSON 
    // Goal is to change _id to id and not 'return' password once saved
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id; // Changing _id to id 
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});
// pre if a middleware function. Used to run a function before
// doing an action on the db, in our case 'save' 
userSchema.pre('save', async function (done) {
    // if the password is newlycreated or is modified
    // then only will we hash the password.
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    };
    done();
});

// mongoose doesn't let TS handle inference and so we will fix that manually 
// by using the interface we wrote above and using the below function to create
// a new user rather than instantiating 'new User' directly
// we will add this as a method to the User model like : 
// This much only is required in JS but not in TS 
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};
// Telling User model about our custom UserModel interface 
// Only required in TS 
// 1st argument tells what all attributes can a User model have 
// 2nd argument tells, that User model will return something of type 'UserModel'
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };

/********************************************************************
 * < brackets > ? GENERICS in TS
 * In TS, the we can pass in Generic Types (types that they can have)
 * by using <> brackets. These are optional. These take in arguments
 * that specify the types.
 ********************************************************************/