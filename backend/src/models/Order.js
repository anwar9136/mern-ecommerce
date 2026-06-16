import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        priceAtPurchase: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        name: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
    },
    paymentId: String,
    razorpayOrderId: String,
    status: {
        type: String,
        enum: ["pending", "paid", "failed", "shipped", "delivered", "cancelled"],
        default: "pending"
    }
}, {
    timestamps: true
});

export default mongoose.model("Order", orderSchema);
