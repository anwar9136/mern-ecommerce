import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        priceAtAdd: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

cartSchema.pre('save', function () {
    this.totalAmount = this.items.reduce((total, item) => total + item.priceAtAdd * item.quantity, 0);
});

cartSchema.index({ user: 1, 'items.product': 1 }, { unique: true });

export default mongoose.model('Cart', cartSchema);