import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// scrypt is used to encrypt the password just like bcrypt 
// scrypt is callback based, but we want it to be async
// so we will pomisify it 
const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}`;
    }
    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
        // converted password to hash === stored hashed password ? returns true | false
        return buf.toString('hex') === hashedPassword;
    }
};

/****************************************************************
 * Static methods:
 * methods which we can access without making instance of a class
 * like : Password.toHash()
 */