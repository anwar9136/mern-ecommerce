import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiCheck, FiTruck, FiHome, FiChevronRight } from 'react-icons/fi';
import { getOrders } from '../services/api';
import toast from 'react-hot-toast';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders();
                setOrders(response.data || []);
            } catch (error) {
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStep = (status) => {
        switch (status) {
            case 'pending': return 0;
            case 'paid': return 1;
            case 'shipped': return 2;
            case 'delivered': return 3;
            case 'cancelled': return -1;
            default: return 0;
        }
    };

    const StatusProgressBar = ({ status }) => {
        const step = getStatusStep(status);
        const steps = [
            { label: 'Order Confirmed', icon: FiCheck },
            { label: 'Shipped', icon: FiTruck },
            { label: 'Delivered', icon: FiHome }
        ];

        if (status === 'cancelled') {
            return (
                <div className="flex items-center justify-center py-4">
                    <span className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-full border border-red-100">
                        Order Cancelled
                    </span>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-between w-full max-w-md mx-auto py-6">
                {steps.map((s, index) => {
                    const Icon = s.icon;
                    const isActive = step > index;
                    const isCurrent = step === index + 1;

                    return (
                        <div key={index} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive || isCurrent
                                        ? 'bg-amber-800 text-white'
                                        : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    <Icon size={18} />
                                </div>
                                <span className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${isActive || isCurrent ? 'text-gray-900' : 'text-gray-400'
                                    }`}>
                                    {s.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-16 sm:w-24 h-0.5 mx-2 transition-all duration-300 ${isActive ? 'bg-amber-800' : 'bg-gray-200'
                                    }`} />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
            {/* Header */}
            <div className="flex justify-between items-baseline mb-12">
                <div>
                    <h1 className="text-4xl font-serif text-gray-900 font-light">My Orders</h1>
                    <p className="text-sm text-gray-500 mt-2">Track your purchases and order history</p>
                </div>
                <Link
                    to="/"
                    className="text-[12px] text-gray-500 uppercase tracking-widest hover:text-black transition-colors font-bold flex items-center gap-2"
                >
                    Continue shopping <FiChevronRight />
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <FiPackage className="mx-auto text-gray-300 mb-6" size={64} />
                    <h2 className="text-2xl font-serif text-gray-600 mb-4">No orders yet</h2>
                    <p className="text-gray-400 mb-8">Start shopping to see your orders here</p>
                    <Link
                        to="/products"
                        className="inline-block px-10 py-3 bg-gray-900 text-white text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-black transition-all duration-300"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden"
                        >
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Order ID</span>
                                        <span className="text-sm font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Order Date</span>
                                        <span className="text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Total</span>
                                        <span className="text-sm font-bold text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'paid' ? 'bg-green-50 text-green-600 border border-green-100' :
                                        order.status === 'shipped' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                            order.status === 'delivered' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                                order.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                    'bg-amber-50 text-amber-600 border border-amber-100'
                                    }`}>
                                    {order.status === 'paid' ? 'Confirmed' : order.status}
                                </div>
                            </div>

                            {/* Status Progress Bar */}
                            <div className="px-6 border-b border-gray-50">
                                <StatusProgressBar status={order.status} />
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-50"
                                        >
                                            <div className="w-20 h-24 flex-shrink-0 bg-white rounded overflow-hidden border border-gray-100">
                                                <img
                                                    src={item.product?.images?.[0] || 'https://via.placeholder.com/80x96'}
                                                    alt={item.product?.title || 'Product'}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    to={`/product/${item.product?.slug}`}
                                                    className="text-base font-serif text-gray-900 hover:text-amber-800 transition-colors line-clamp-1"
                                                >
                                                    {item.product?.title || 'Product'}
                                                </Link>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                                    <span className="text-sm font-bold text-gray-900">₹{item.priceAtPurchase?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {order.shippingAddress && (
                                <div className="px-6 pb-6">
                                    <div className="p-4 bg-amber-50/30 rounded-lg border border-amber-100/50">
                                        <span className="text-[10px] text-amber-800 uppercase tracking-widest font-bold block mb-2">Shipping Address</span>
                                        <p className="text-sm text-gray-700">
                                            {order.shippingAddress.name}, {order.shippingAddress.phone}<br />
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.pincode}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
