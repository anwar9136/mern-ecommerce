import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/api';
import ProductCard from '../ProductCard';

export default function Bestsellers() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestsellers = async () => {
            try {
                // Query param 'isBestseller' will be handled by backend
                const response = await getProducts({ isBestseller: true, limit: 4 });
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching bestsellers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBestsellers();
    }, []);

    if (!loading && products.length === 0) return null;

    return (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white">
            <div className="flex flex-col items-center mb-12">
                <h2 className="text-3xl font-serif text-gray-900 tracking-wide mb-2">Our Bestsellers</h2>
                <div className="w-20 h-[1px] bg-amber-800"></div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-800"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                        {products.slice(0, 4).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <div className="mt-16 flex justify-center">
                        <Link
                            to="/products?view=bestsellers"
                            className="px-10 py-3 bg-white border border-black text-black text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-black hover:text-white transition-all duration-300"
                        >
                            View all
                        </Link>
                    </div>
                </>
            )}
        </section>
    );
}
