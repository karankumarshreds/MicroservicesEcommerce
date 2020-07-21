import mongoose from 'mongoose';
import { OrderStatus } from '@karantickets/common';
import { Order } from './order';

interface TicketAttrs {
    title: string;
    price: number;
}

// will also be used in the order model
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}
// Adding method to the document to find if the ticket is reserved or not 
// Run query to look at all orders and find an order where
// the ticket is the ticket we just found *and* the order status is *not* cancelled 
// Thus is we still find any ticket it would mean that it is reserved
ticketSchema.methods.isReserved = async function () {
    // this === ticket instance that we call this funcion on 
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.Complete,
                OrderStatus.AwaitingPayment
            ]
        }
    });
    // this returns doc or null, but we want true or false 
    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
export { Ticket }
