import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductBySlug, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import {
    ShoppingBag,
    Heart,
    Share2,
    ChevronRight,
    ChevronLeft,
    Truck,
    ShieldCheck,
    RefreshCw,
    Loader2,
    CheckCircle2,
    Wind,
    Hand,
    Gem
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);
    const { addItem } = useCart();
    const navigate = useNavigate();

    const handleAddToBag = async () => {
        setAdding(true);
        const success = await addItem(product._id, quantity);
        setAdding(false);
        if (success) {
            toast.success("Added to bag");
        }
    };

    const handleBuyItNow = async () => {
        setAdding(true);
        const success = await addItem(product._id, quantity);
        setAdding(false);
        if (success) {
            navigate('/cart');
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductBySlug(slug);
                const fetchedProduct = response.data;
                setProduct(fetchedProduct);

                // Fetch related products from same category
                if (fetchedProduct.category?._id) {
                    const relatedRes = await getProducts({
                        category: fetchedProduct.category._id,
                        limit: 5
                    });
                    setRelatedProducts(relatedRes.data.filter(p => p._id !== fetchedProduct._id).slice(0, 4));
                }

                // Fetch bestsellers
                const bestsellersRes = await getProducts({ isBestseller: true, limit: 5 });
                setBestsellers(bestsellersRes.data.filter(p => p._id !== fetchedProduct._id).slice(0, 4));
            } catch (error) {
                toast.error("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-amber-800" size={40} />
                <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Unveiling Perfection...</p>
            </div>
        );
    }

    if (!product) return <div className="text-center py-20 font-bold uppercase tracking-widest text-gray-400">Product not found</div>;

    const discount = product.salePrice
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : 0;

    return (
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 border-b border-gray-100 pb-3">
                <Link to="/" className="hover:text-amber-800 transition-colors">Home</Link>
                <ChevronRight size={12} />
                <Link to={`/category/${product.category?.slug}`} className="hover:text-amber-800 transition-colors">{product.category?.name}</Link>
                <ChevronRight size={12} />
                <span className="text-gray-900 truncate italic font-serif lowercase tracking-normal text-[11px]">{product.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Image Gallery */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="aspect-[3/4.2] overflow-hidden bg-gray-50 relative group rounded-sm shadow-sm border border-gray-100">
                        {product.images?.[selectedImage] ? (
                            <img
                                src={product.images[selectedImage].url || product.images[selectedImage]}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <ShoppingBag size={48} />
                            </div>
                        )}
                        {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-amber-800 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg">
                                {discount}% OFF
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images?.length > 1 && (
                        <div className="grid grid-cols-6 gap-3">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`aspect-square overflow-hidden bg-gray-50 border transition-all rounded-sm ${selectedImage === idx ? 'border-amber-800 opacity-100 scale-105 shadow-sm' : 'border-gray-100 opacity-50 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img.url || img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="lg:col-span-6 flex flex-col pt-2">
                    <div className="mb-6 pb-6 border-b border-gray-50">
                        <div className="mb-4">
                            <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 leading-tight mb-2 italic">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Authentic Handmade</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            {product.salePrice && product.salePrice < product.price ? (
                                <>
                                    <span className="text-xs font-light text-gray-400 line-through">Rs. {product.price.toLocaleString()}.00</span>
                                    <span className="text-xl font-serif text-gray-900 tracking-tight">Rs. {product.salePrice.toLocaleString()}.00</span>
                                    <span className="bg-amber-50 text-amber-800 text-[9px] font-black px-2 py-0.5 uppercase tracking-widest border border-amber-100">Special Price</span>
                                </>
                            ) : (
                                <span className="text-xl font-serif text-gray-900 tracking-tight">Rs. {product.price.toLocaleString()}.00</span>
                            )}
                        </div>

                        <p className="text-[10px] text-gray-400 mb-6 uppercase tracking-widest font-medium">Inclusive of all taxes</p>

                        {/* Benefit Icons */}
                        <div className="grid grid-cols-3 gap-2 mb-8 text-center py-5 bg-gray-50/50 rounded-lg border border-gray-100/50">
                            {[
                                { icon: Wind, label: 'Natural Fibre' },
                                { icon: Hand, label: 'Handcrafted' },
                                { icon: Gem, label: 'Original Art' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-1.5 px-2">
                                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-800 shadow-sm">
                                        <item.icon size={14} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-gray-500 leading-tight">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Fabric Detail</label>
                                <div className="inline-block px-4 py-2 bg-white border border-gray-100 text-[11px] font-bold uppercase tracking-widest text-gray-800 shadow-sm rounded-sm">
                                    {product.fabric || 'Premium Silk Cotton'}
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-sm prose-zinc text-gray-600">
                            <p className="text-[13px] leading-relaxed italic font-serif border-l-2 border-amber-800/20 pl-4 py-1">
                                {product.description}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                            <div className="flex-shrink-0">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Quantity</label>
                                <div className="flex items-center border border-gray-200 rounded-sm w-32 h-11 bg-white shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex-1 flex justify-center items-center h-full hover:bg-gray-50 transition-colors border-r border-gray-100"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="flex-1 text-center font-serif text-[13px] font-medium">{quantity}</span>
                                    <button
                                        onClick={() => {
                                            if (quantity + 1 > product.stock) {
                                                toast.error(`Only ${product.stock} items available in stock`);
                                                return;
                                            }
                                            setQuantity(quantity + 1);
                                        }}
                                        className="flex-1 flex justify-center items-center h-full hover:bg-gray-50 transition-colors border-l border-gray-100"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-grow w-full space-y-3">
                                <button
                                    onClick={handleAddToBag}
                                    disabled={adding || product.stock <= 0}
                                    className="w-full h-11 bg-white text-gray-900 border border-gray-900 rounded-sm font-black uppercase tracking-[0.3em] text-[10px] hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {adding ? <Loader2 className="animate-spin" size={16} /> : (product.stock <= 0 ? 'Sold Out' : 'Add to bag')}
                                </button>
                                <button
                                    onClick={handleBuyItNow}
                                    disabled={adding || product.stock <= 0}
                                    className="w-full h-11 bg-black text-white rounded-sm font-black uppercase tracking-[0.3em] text-[10px] hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center disabled:opacity-50"
                                >
                                    {adding ? <Loader2 className="animate-spin" size={16} /> : 'Express Checkout'}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-6 py-4 border-y border-gray-50 bg-gray-50/20">
                            {[
                                { icon: Truck, text: 'Free Delivery' },
                                { icon: ShieldCheck, text: 'Signature Authentic' },
                                { icon: RefreshCw, text: 'Easy Returns' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <item.icon size={12} className="text-amber-800" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-gray-500">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Share */}
                </div>
            </div>

            {/* You May Also Like Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-20 pt-16 border-t border-gray-100">
                    <h2 className="text-2xl font-serif text-gray-900 mb-2 italic">You may also like</h2>
                    <p className="text-sm text-gray-400 mb-8">More handcrafted pieces from this collection</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            )}

            {/* Bestsellers Section */}
            {bestsellers.length > 0 && (
                <div className="mt-20 pt-16 border-t border-gray-100">
                    <h2 className="text-2xl font-serif text-gray-900 mb-2 italic">Our Bestsellers</h2>
                    <p className="text-sm text-gray-400 mb-8">Most loved pieces by our customers</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {bestsellers.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
