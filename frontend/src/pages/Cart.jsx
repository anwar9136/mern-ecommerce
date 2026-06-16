import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiX, FiChevronRight, FiPhone, FiMapPin, FiUser, FiTruck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { createOrder, verifyPayment } from '../services/api';
import toast from 'react-hot-toast';

export default function Cart() {
    const { cart, loading, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();
    const [checkingOut, setCheckingOut] = useState(false);
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const handleShippingChange = (e) => {
        setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckoutInit = (e) => {
        e.preventDefault();
        setShowShippingModal(true);
    };

    const handleFinalPayment = async (e) => {
        e.preventDefault();

        if (!shippingDetails.name || !shippingDetails.phone || !shippingDetails.address) {
            toast.error("Please fill in main shipping details");
            return;
        }

        setCheckingOut(true);

        try {
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load');
                return;
            }

            const orderRes = await createOrder(shippingDetails);
            const { amount, currency, orderId, key } = orderRes.data;

            const options = {
                key,
                amount,
                currency,
                name: "Kaisori Saree Ecommerce",
                description: "Purchase of authentic handmade sarees",
                order_id: orderId,
                handler: async function (response) {
                    try {
                        const verificationRes = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verificationRes.data.success) {
                            toast.success('Order placed successfully!');
                            navigate('/order-success');
                        }
                    } catch (error) {
                        toast.error('Payment verification failed');
                    }
                },
                modal: {
                    ondismiss: async function () {
                        // DEMO MODE: Complete order even when payment fails/cancelled
                        try {
                            const verificationRes = await verifyPayment({
                                razorpay_order_id: orderId,
                                razorpay_payment_id: null,
                                razorpay_signature: null
                            });

                            if (verificationRes.data.success) {
                                toast.success('Order placed successfully!');
                                navigate('/order-success');
                            }
                        } catch (error) {
                            console.log('Order confirmation failed:', error);
                        }
                    }
                },
                prefill: {
                    name: shippingDetails.name,
                    contact: shippingDetails.phone
                },
                theme: {
                    color: "#92400e"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setShowShippingModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Checkout failed');
        } finally {
            setCheckingOut(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <h2 className="text-3xl font-serif text-gray-900 mb-6 font-light">Your cart is empty</h2>
                <Link
                    to="/"
                    className="px-10 py-3 bg-gray-900 text-white text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-black transition-all duration-300"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex justify-between items-baseline mb-10">
                <h1 className="text-4xl font-serif text-gray-900 font-light">Your cart</h1>
                <Link to="/" className="text-[12px] text-gray-500 uppercase tracking-widest hover:text-black transition-colors font-bold flex items-center gap-2">
                    Continue shopping <FiChevronRight />
                </Link>
            </div>

            {/* Cart Table Headers */}
            <div className="hidden md:grid grid-cols-12 border-b border-gray-100 pb-3 mb-8 text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
            </div>

            {/* Cart Items */}
            <div className="space-y-8">
                {cart.items.filter(item => item.product).map((item) => (
                    <div key={item.product._id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 pb-8 border-b border-gray-50 last:border-0 relative group">
                        {/* Product Info */}
                        <div className="col-span-1 md:col-span-6 flex items-start space-x-8">
                            <div className="w-24 h-32 flex-shrink-0 bg-gray-50 border border-gray-100 overflow-hidden rounded-sm transition-transform duration-500 group-hover:scale-[1.02]">
                                <img
                                    src={item.product.images?.[0] || 'https://via.placeholder.com/96x128'}
                                    alt={item.product.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <Link to={`/product/${item.product.slug}`} className="text-lg font-serif text-gray-900 hover:text-amber-800 transition-colors leading-tight">
                                    {item.product.title}
                                </Link>
                                <div className="mt-2 flex items-center space-x-3">
                                    {item.product.salePrice && item.product.salePrice < item.product.price ? (
                                        <>
                                            <span className="text-gray-400 line-through text-xs font-light">Rs. {item.product.price.toLocaleString()}.00</span>
                                            <span className="text-gray-900 text-sm font-medium tracking-tight">Rs. {item.product.salePrice.toLocaleString()}.00</span>
                                        </>
                                    ) : (
                                        <span className="text-gray-900 text-sm font-medium tracking-tight">Rs. {item.product.price.toLocaleString()}.00</span>
                                    )}
                                </div>
                                {item.product.category && (
                                    <div className="mt-4 inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50/50 px-2 py-1 rounded-sm w-fit border border-gray-100">
                                        {item.product.category.name}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quantity Control */}
                        <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center">
                            <div className="flex items-center border border-gray-200 bg-white shadow-sm">
                                <button
                                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                    className="p-3 text-gray-400 hover:text-black transition-colors"
                                    disabled={item.quantity <= 1}
                                >
                                    <FiMinus size={14} />
                                </button>
                                <span className="w-10 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                                <button
                                    onClick={() => {
                                        if (item.quantity + 1 > item.product.stock) {
                                            toast.error(`Only ${item.product.stock} items available in stock`);
                                            return;
                                        }
                                        updateQuantity(item.product._id, item.quantity + 1);
                                    }}
                                    className="p-3 text-gray-400 hover:text-black transition-colors"
                                >
                                    <FiPlus size={14} />
                                </button>
                            </div>
                            <button
                                onClick={() => removeItem(item.product._id)}
                                className="mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-300 hover:text-red-400 transition-colors flex items-center gap-1.5"
                                title="Remove item"
                            >
                                <FiTrash2 size={12} /> Remove
                            </button>
                        </div>

                        <div className="col-span-1 md:col-span-3 text-right">
                            <div className="flex flex-col">
                                {item.product.salePrice && item.product.salePrice < item.product.price && (
                                    <span className="text-gray-400 line-through text-[11px] mb-1 font-light">
                                        Rs. {(item.product.price * item.quantity).toLocaleString()}.00
                                    </span>
                                )}
                                <span className="text-xl font-serif text-gray-900 tracking-tight">
                                    Rs. {((item.product.salePrice && item.product.salePrice < item.product.price ? item.product.salePrice : item.product.price) * item.quantity).toLocaleString()}.00
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Section */}
            <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-gray-100 pt-12">
                {/* Promo / Info */}
                <div className="space-y-8 text-left">
                    <div className="p-6 bg-gray-50/50 rounded-sm border border-gray-100/50 space-y-4 shadow-sm">
                        <h4 className="text-[11px] uppercase tracking-widest font-black text-gray-900 flex items-center gap-2">
                            <FiTruck className="text-amber-800" size={14} /> Complimentary Shipping
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-light">
                            Signature Kaisori packaging included. Standard delivery within 7-10 working days across India. All sarees are carefully inspected for quality.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">
                            Order Notes (Optional)
                        </label>
                        <textarea
                            className="w-full h-32 border border-gray-100 p-4 focus:border-gray-400 outline-none transition-all resize-none text-[13px] bg-white font-light text-gray-600 shadow-sm"
                            placeholder="Add a gift message or delivery instructions..."
                        ></textarea>
                    </div>
                </div>

                {/* Subtotal & Checkout */}
                <div className="flex flex-col items-end pt-4">
                    <div className="flex items-baseline space-x-12 mb-2">
                        <span className="text-xl font-serif text-gray-400 font-light italic">Estimate total</span>
                        <span className="text-3xl font-serif text-gray-900 tracking-tighter">
                            Rs. {cart.totalAmount?.toLocaleString() || '0'}.00
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium mb-10">
                        Shipping & Taxes calculated at checkout
                    </p>
                    <button
                        onClick={handleCheckoutInit}
                        className="w-full lg:w-full max-w-sm py-5 bg-black text-white text-[12px] uppercase tracking-[0.3em] font-black shadow-2xl hover:bg-zinc-800 transition-all duration-300 relative overflow-hidden group"
                    >
                        <span className="relative z-10">Secure Checkout</span>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-800 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                    </button>
                    <div className="mt-8 flex items-center gap-5 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-5" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3.5" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                    </div>
                </div>
            </div>

            {showShippingModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowShippingModal(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 space-y-8 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-6">
                            <div className="text-left">
                                <h3 className="text-2xl font-serif text-gray-900 italic">Shipping Details</h3>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Where should we send your saree?</p>
                            </div>
                            <button onClick={() => setShowShippingModal(false)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleFinalPayment} className="grid grid-cols-2 gap-5">
                            <div className="col-span-2 space-y-1.5 text-left">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 flex items-center gap-2">
                                    <FiUser size={12} className="text-amber-800" /> Full Name
                                </label>
                                <input
                                    required
                                    name="name"
                                    value={shippingDetails.name}
                                    onChange={handleShippingChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 outline-none transition-all text-sm font-medium"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="col-span-2 space-y-1.5 text-left">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 flex items-center gap-2">
                                    <FiPhone size={12} className="text-amber-800" /> Phone Number
                                </label>
                                <input
                                    required
                                    name="phone"
                                    value={shippingDetails.phone}
                                    onChange={handleShippingChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 outline-none transition-all text-sm font-medium"
                                    placeholder="+91"
                                />
                            </div>

                            <div className="col-span-2 space-y-1.5 text-left">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400 flex items-center gap-2">
                                    <FiMapPin size={12} className="text-amber-800" /> Delivery Address
                                </label>
                                <textarea
                                    required
                                    name="address"
                                    value={shippingDetails.address}
                                    onChange={handleShippingChange}
                                    rows="2"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 outline-none transition-all text-sm font-medium resize-none"
                                    placeholder="Street address, building, apartment..."
                                ></textarea>
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">City</label>
                                <input
                                    required
                                    name="city"
                                    value={shippingDetails.city}
                                    onChange={handleShippingChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/50 focus:border-amber-800 outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Pincode</label>
                                <input
                                    required
                                    name="pincode"
                                    value={shippingDetails.pincode}
                                    onChange={handleShippingChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50/50 focus:border-amber-800 outline-none transition-all text-sm"
                                />
                            </div>

                            <button
                                disabled={checkingOut}
                                type="submit"
                                className="col-span-2 py-4 bg-amber-800 text-white rounded-xl text-[12px] uppercase tracking-[0.2em] font-black shadow-xl hover:bg-amber-900 transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
                            >
                                {checkingOut ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing Order...
                                    </>
                                ) : (
                                    <>Pay Rs. {cart.totalAmount?.toLocaleString()} Now</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
