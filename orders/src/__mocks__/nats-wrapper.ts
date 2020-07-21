/**
 * We are trying to duplicate the functionality of real 
 * natsWrapper and hence exporting it right away.
 */
// we just need to replicate the client attribute as the 
// new ticket creation route only uses client attribute 

// # lecture 314
export const natsWrapper = {
    client: {
        publish: jest.fn().mockImplementation(
            (subject: string, data: string, callback: () => void) => {
                callback();
            })
    }
};

// now test Jest to use this fake natsWrapper