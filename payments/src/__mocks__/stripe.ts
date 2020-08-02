export const stripe = {
    charges: {
        // mockResolveValue mocks a promise function
        create: jest.fn().mockResolvedValue({}),
    },
};