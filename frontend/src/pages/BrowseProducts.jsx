import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Loader2, ChevronRight, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const BrowseProducts = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const view = queryParams.get('view');

    const title = useMemo(() => {
        if (view === 'bestsellers') return 'Our Bestsellers';
        if (view === 'featured') return 'Watch & Buy';
        return 'All Products';
    }, [view]);

    const subtitle = useMemo(() => {
        if (view === 'bestsellers') return 'Most loved pieces from our collection';
        if (view === 'featured') return 'Curated handcrafted masterpieces';
        return 'Explore our complete range of authentic sarees';
    }, [view]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let params = { limit: 50 };
                if (view === 'bestsellers') params.isBestseller = true;
                if (view === 'featured') params.featured = true;

                const response = await getProducts(params);
                setProducts(response.data);
            } catch (error) {
                toast.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [view]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-amber-800" size={40} />
                <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Curating your selection...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-medium text-gray-400 mb-12 pb-4 border-b border-gray-50 uppercase tracking-widest">
                <Link to="/" className="hover:text-black transition-colors">Home</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900">{title}</span>
            </nav>

            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-serif text-gray-900 italic font-light">{title}</h1>
                <p className="text-gray-500 text-sm font-light tracking-wide">{subtitle}</p>
                <div className="w-12 h-[1px] bg-amber-800 mx-auto mt-6"></div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
                    <ShoppingBag className="text-gray-300 mx-auto mb-4" size={48} strokeWidth={1} />
                    <h3 className="text-lg font-serif italic text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 text-xs uppercase tracking-widest">We are currently updating this collection.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseProducts;
