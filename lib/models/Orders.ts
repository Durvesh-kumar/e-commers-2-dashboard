import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerClerkId: String,

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            collectionId: String,
            color: String,
            size: String,
            quantity: Number,
        }
    ],

    shippingAddress: {
        street: String,
        state: String,
        city: String,
        country: String,
        postalCode: String,

    },
    totalAmount: Number,
    shippingRate: String,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;