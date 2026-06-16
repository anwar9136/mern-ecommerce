import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import { ShoppingBag, Loader2, Filter, ChevronRight, Image as ImageIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const CategoryProducts = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryData = async () => {
            setLoading(true);
            try {
                // Fetch all categories to find the current one and its children
                const categoriesRes = await getCategories();
                const allCategories = categoriesRes.data;
                const currentCat = allCategories.find(c => c.slug === slug);
                setCategory(currentCat);

                if (currentCat) {
                    // Find all children IDs if this is a parent category
                    const childrenIds = allCategories
                        .filter(c => (typeof c.parent === 'object' ? c.parent?._id : c.parent) === currentCat._id)
                        .map(c => c._id);

                    const categoryIds = [currentCat._id, ...childrenIds];

                    // Fetch products that match any of these category IDs
                    const productsRes = await getProducts({ category: categoryIds.join(',') });
                    setProducts(productsRes.data);
                }
            } catch (error) {
                toast.error("Error loading products");
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-amber-800" size={40} />
                <p className="text-gray-500 font-medium animate-pulse">Loading Collection...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] sm:text-[11px] font-medium text-gray-400 mb-8 pb-4 border-b border-gray-50">
                <Link to="/" className="hover:text-black transition-colors">Home</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900">{category?.name || 'Collection'}</span>
            </nav>

            {/* Simple Category Banner */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center mb-16">
                <div className="md:col-span-6 space-y-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-light text-gray-900 leading-tight">
                            {category?.name}
                        </h1>
                    </div>

                    <div className="space-y-6">
                        {category?.description ? (
                            category.description.split('\n\n').map((para, idx) => {
                                const isHeading = para.includes(':');
                                if (isHeading) {
                                    const [heading, content] = para.split(':');
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <p className="text-[14px] font-bold text-gray-900">{heading}:</p>
                                            <p className="text-gray-600 text-[14px] leading-relaxed">
                                                {content}
                                            </p>
                                        </div>
                                    );
                                }
                                return (
                                    <p key={idx} className="text-gray-600 text-[14px] leading-relaxed">
                                        {para}
                                    </p>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-[14px] leading-relaxed">
                                This collection celebrates the beauty of craftsmanship. Each piece is truly one of a kind, reflecting the rich heritage of Indian crafts and the natural variations born from the hand-weaving process.
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-6 pt-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                        <span className="flex items-center gap-2">
                            <ShoppingBag size={14} className="text-gray-900" />
                            {products.length} Products
                        </span>
                    </div>
                </div>

                <div className="md:col-span-6">
                    <div className="aspect-[4/3] overflow-hidden bg-gray-50 rounded-sm group shadow-sm border border-gray-100">
                        {category?.image ? (
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                <ImageIcon size={60} strokeWidth={1} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50/50 rounded-sm border border-dashed border-gray-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <ShoppingBag className="text-gray-300" size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">Coming Soon</h3>
                    <p className="text-gray-500 text-[11px] uppercase tracking-widest">We are updating this collection soon.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryProducts;
