export enum OrderStatus {
    /** when the order has been created and the corresponding ticket is not reserved yet 
     * in other words, the order for the ticket (ticket is available) is created (new.ts)
    */
    Created = 'created',
    /** The corresponding ticket has already been reserved or user has cancelled the order 
     *  or if the order expires before payment
     */
    Cancelled = 'cancelled',
    /** The order has successfully reserved the ticket */
    AwaitingPayment = 'awaiting:payment',
    /** The order has reserved the ticket and the user has provided the payment successfully */
    Complete = 'complete'
}