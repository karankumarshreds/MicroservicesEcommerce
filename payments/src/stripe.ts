import Stripe from 'stripe';


/**
 * Lecture #430
 * Purpose of this file is to create an instance of the stripe library and export it.
 */

// arg #1 : Stripe secret key 
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2020-03-02'
});   
