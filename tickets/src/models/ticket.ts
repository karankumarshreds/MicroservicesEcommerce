import mongoose from 'mongoose';

// ## 1
// interface to describe the properties 
// needed to be passed while creation 
// note : from the users end 
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// ## 2
// interface that describes properties
// of individual ticket object
// note : it can have extra attributes
// generated by the backend like Date
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
};

// ## 3
// interface to tie some properties
// (build method here) with the model
// just like the inbuilt find() method
interface TicketModel extends mongoose.Model<TicketDoc> {
    // method will save object in form of TicketDoc
    build(attrs: TicketAttrs): TicketDoc;
};


const ticketSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    price: {
        type: String, required: true
    },
    userId: {
        type: String, required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

// Using interface ##1 while creation
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};
// Using interface ##2 & ##3 
// 1st argument : attributes that model will save 
// 2nd argument : how the model will behave 
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket }

