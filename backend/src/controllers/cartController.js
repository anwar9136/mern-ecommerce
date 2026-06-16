import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate({
                path: 'items.product',
                populate: { path: 'category', select: 'name' }
            });

        if (!cart) {
            return res.json({ items: [], totalAmount: 0 });
        }

        return res.json(cart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.stock < quantity) return res.status(400).json({ message: 'Not enough stock' });

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
            if (cart.items[existingItemIndex].quantity > product.stock) {
                return res.status(400).json({ message: 'Not enough stock' });
            }
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                priceAtAdd: product.price
            });
        }

        await cart.save();
        await cart.populate({
            path: 'items.product',
            populate: { path: 'category', select: 'name' }
        });

        res.status(201).json(cart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.json({ items: [], totalAmount: 0 });

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) return res.status(404).json({ message: 'Item not in cart' });

        const product = await Product.findById(productId);
        if (quantity > product.stock) return res.status(400).json({ message: 'Not enough stock' });

        item.quantity = quantity;
        await cart.save();

        await cart.populate({
            path: 'items.product',
            populate: { path: 'category', select: 'name' }
        });

        res.json(cart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.json({ items: [], totalAmount: 0 });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        await cart.populate({
            path: 'items.product',
            populate: { path: 'category', select: 'name' }
        });

        res.json(cart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.user.id });
        res.json({ items: [], totalAmount: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

