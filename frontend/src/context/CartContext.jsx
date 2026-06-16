import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await getCart();
            setCart(response.data);
        } catch (error) {
            // Only log if it's not a 401 (Unauthorized) which is expected for guests
            if (error.response?.status !== 401) {
                console.error("Error fetching cart:", error);
            }
            setCart({ items: [], totalAmount: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addItem = async (productId, quantity = 1) => {
        try {
            const response = await addToCart(productId, quantity);
            setCart(response.data);
            toast.success('Item added to cart');
            return true;
        } catch (error) {
            console.error("Error adding to cart:", error);
            const message = error.response?.data?.message || 'Failed to add item';
            toast.error(message);
            return false;
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await updateCartItem(productId, quantity);
            setCart(response.data);
            return true;
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error(error.response?.data?.message || 'Failed to update quantity');
            return false;
        }
    };

    const removeItem = async (productId) => {
        try {
            const response = await removeFromCart(productId);
            setCart(response.data);
            toast.success('Item removed from cart');
            return true;
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error('Failed to remove item');
            return false;
        }
    };

    const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addItem,
            updateQuantity,
            removeItem,
            fetchCart,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
