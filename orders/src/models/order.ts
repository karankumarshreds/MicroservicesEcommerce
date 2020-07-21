import mongoose, { Mongoose } from 'mongoose';

// while creating 
interface OrderAttrs {
    userId: string;
    status: string;
    expiresAt: Date;
    ticket: TickerDoc;
}

// while saving 
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: string;
    expiresAt: Date;
    ticket: TickerDoc;
}

// interface for a new method so that we 
// can have type check while building
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    status: { type: String, required: true },
    expiresAt: { type: mongoose.Schema.Types.Date },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};
// mongoose model
/**
 * Since the original model method is based off of the built in Doc and Model
 * And since we changed it, we are passing in the generic type definitions 
 */
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
export { Order }

const x = new Order()
