import Razorpay from "razorpay";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (req, res) => {
    const { shippingAddress } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create order on Razorpay
        const razorpayOrder = await razorpay.orders.create({
            amount: cart.totalAmount * 100,  // in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        });

        // Save order in DB (pending)
        const order = new Order({
            user: req.user.id,
            items: cart.items
                .filter(item => item.product) // Defense against deleted products
                .map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    priceAtPurchase: item.priceAtAdd
                })),
            totalAmount: cart.totalAmount,
            shippingAddress,
            razorpayOrderId: razorpayOrder.id,
            status: 'pending'
        });
        await order.save();

        res.json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DEMO MODE: Always succeed payment verification
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        // Find the order by razorpay order ID
        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                paymentId: razorpay_payment_id || `demo_${Date.now()}`,
                status: 'paid'
            },
            { new: true }
        );

        if (order) {
            // Update stock for each product
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }

            // Clear cart after successful order
            await Cart.findOneAndDelete({ user: req.user.id });

            res.json({ success: true, message: 'Order confirmed successfully!' });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's orders
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get ALL orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'title images price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('getAllOrders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};