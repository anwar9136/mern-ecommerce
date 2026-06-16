import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getProducts } from '../../services/api';

export default function WatchAndBuy() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await getProducts({ featured: true, limit: 10 });
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching featured:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    if (loading && products.length === 0) return null;

    return (
        <section className="bg-[#fafafa] py-10">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-serif text-gray-900 mb-12 tracking-wide">Watch and buy</h2>

                <div className="relative group/slider">
                    <div
                        ref={scrollContainerRef}
                        className="flex space-x-5 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
                    >
                        {products.map((product) => (
                            <div key={product._id} className="flex-shrink-0 w-[240px] bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <Link to={`/product/${product.slug}`} className="block relative aspect-[9/16]">
                                    <img
                                        src={product.images[0] || 'https://via.placeholder.com/300x533'}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white text-left">
                                        <h3 className="text-sm font-medium line-clamp-2 leading-tight mb-2 uppercase tracking-wide">{product.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-bold">₹ {product.salePrice || product.price}</span>
                                                {product.salePrice && <span className="text-xs text-gray-300 line-through">₹ {product.price}</span>}
                                            </div>
                                            {product.salePrice && (
                                                <span className="bg-[#258a12] text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                                                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% off
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-16 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 hover:bg-black/30 duration-300"
                        aria-label="Scroll left"
                    >
                        <FiChevronLeft size={60} className="text-white drop-shadow-md" />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-[60%] w-16 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 hover:bg-black/30 duration-300"
                        aria-label="Scroll right"
                    >
                        <FiChevronRight size={60} className="text-white drop-shadow-md" />
                    </button>
                </div>

                <div className="mt-16 flex justify-center">
                    <Link
                        to="/products?view=featured"
                        className="px-10 py-3 bg-gray-900 text-white text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-black transition-all duration-300"
                    >
                        View all
                    </Link>
                </div>
            </div>
        </section >
    );
}
