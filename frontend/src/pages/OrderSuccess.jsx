import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';

const OrderSuccess = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#fafafa]">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-gray-50 text-center space-y-8">
                <div className="flex justify-center">
                    <div className="bg-green-50 p-4 rounded-full animate-bounce">
                        <CheckCircle size={64} className="text-green-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-serif text-gray-900">Order Placed!</h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Thank you for your purchase. We've received your order and are preparing it for shipment.
                    </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between text-left">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Order Reference</p>
                        <p className="text-sm font-medium text-gray-900">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Confirmed
                        </span>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <Link
                        to="/"
                        className="w-full py-4 bg-black text-white text-[12px] uppercase tracking-[0.2em] font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg flex items-center justify-center gap-2 group"
                    >
                        Continue Shopping
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        to="/orders"
                        className="w-full py-4 border border-gray-200 text-gray-900 text-[12px] uppercase tracking-[0.2em] font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingBag size={16} />
                        View My Orders
                    </Link>
                </div>

                <p className="text-[11px] text-gray-400">
                    A confirmation email has been sent to your registered address.
                </p>
            </div>
        </div>
    );
};

export default OrderSuccess;
