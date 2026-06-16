import { useState, useEffect } from 'react';
import { getProducts } from '../../services/api';
import ProductCard from '../ProductCard';

export default function NewArrivals() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArrivals = async () => {
            try {
                const response = await getProducts({ sort: 'newest', limit: 4 });
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching arrivals:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArrivals();
    }, []);

    return (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-end mb-10">
                <h2 className="text-2xl font-serif text-gray-900 tracking-wide">New Arrivals</h2>
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
                </>
            )}
        </section>
    );
}
