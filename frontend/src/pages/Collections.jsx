import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/api';
import { Loader2, ChevronRight, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await getCategories();
                // Filter for top level categories only
                setCollections(response.data.filter(c => !c.parent));
            } catch (error) {
                toast.error("Failed to load collections");
            } finally {
                setLoading(false);
            }
        };
        fetchCollections();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-amber-800" size={40} />
                <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Opening the archives...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-medium text-gray-400 mb-12 pb-4 border-b border-gray-50 uppercase tracking-widest">
                <Link to="/" className="hover:text-black transition-colors">Home</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900">Collections</span>
            </nav>

            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-serif text-gray-900 italic font-light">Our Collections</h1>
                <p className="text-gray-500 text-sm font-light tracking-wide">Timeless handcrafts, curated for you</p>
                <div className="w-12 h-[1px] bg-amber-800 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {collections.map((collection) => (
                    <div key={collection._id} className="group cursor-pointer">
                        <div className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-100 rounded-sm">
                            <Link to={`/category/${collection.slug}`}>
                                {collection.image ? (
                                    <img
                                        src={collection.image}
                                        alt={collection.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                                        <ImageIcon size={60} strokeWidth={1} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-col items-center">
                            <Link
                                to={`/category/${collection.slug}`}
                                className="text-lg font-serif italic text-gray-900 group-hover:text-amber-800 transition-colors flex items-center gap-3"
                            >
                                {collection.name}
                                <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">→</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Collections;
