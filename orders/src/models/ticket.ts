import mongoose, { version } from 'mongoose';
import { OrderStatus } from '@karantickets/common';
import { Order } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

// will also be used in the order model
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    // Lecture 370
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,  // because when we recieve ticket from ticket service, it has ID as id
        // but our mongoose DB considers ID to be a DB-ID if it is _id. We are doing this so that 
        // our this DB does not generate a new ID for the recieved ticket and use the 'id' property
        // to be the only ID of the ticket being recieved. Hence, while saving we need to change it 
        // from "id" --> "_id" otherwise mongoose will think "id" (incoming) is some other property
        // and give it an _id of it's own. Which we do not want at any cost.
        title: attrs.title,
        price: attrs.price
    });
}
// Lecture 370
ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version
    })
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
