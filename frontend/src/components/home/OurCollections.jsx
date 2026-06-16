import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../services/api';

export default function OurCollections() {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await getCategories({ isFeatured: true });
                setCollections(response.data);
            } catch (error) {
                console.error("Error fetching collections:", error);
            }
        };
        fetchCollections();
    }, []);

    const fallbackCollections = [
        {
            _id: '1',
            name: 'Handcrafted sarees',
            slug: 'handcrafted-sarees',
            image: 'https://kaisori.com/cdn/shop/files/preview_images/1f49f5d014bf43e7b1372a97adc1d6f0.thumbnail.0000000000.jpg?v=1733844415&width=800'
        },
        {
            _id: '2',
            name: 'natural dyed dabu printed long skirt Noor',
            slug: 'natural-dyed-dabu',
            image: 'https://kaisori.com/cdn/shop/files/preview_images/1f49f5d014bf43e7b1372a97adc1d6f0.thumbnail.0000000000.jpg?v=1733844415&width=800'
        },
        {
            _id: '3',
            name: 'Jewellery & Accessories',
            slug: 'jewellery-accessories',
            image: 'https://kaisori.com/cdn/shop/files/preview_images/1f49f5d014bf43e7b1372a97adc1d6f0.thumbnail.0000000000.jpg?v=1733844415&width=800'
        }
    ];

    const displayCollections = collections.length > 0 ? collections : fallbackCollections;

    return (
        <section className="py-10 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-serif text-gray-900 tracking-wide mb-12 text-left md:px-4">Our collections</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {displayCollections.slice(0, 3).map((collection) => (
                        <div key={collection._id} className="group cursor-pointer">
                            <div className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-100">
                                <Link to={`/category/${collection.slug}`}>
                                    <img
                                        src={collection.image}
                                        alt={collection.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                                </Link>
                            </div>

                            <div className="mt-8 flex items-center">
                                <Link
                                    to={`/category/${collection.slug}`}
                                    className="text-[17px] text-gray-900 group-hover:text-amber-800 transition-colors flex items-center font-light tracking-wide uppercase"
                                >
                                    {collection.name}
                                    <span className="ml-3 text-xl transition-transform duration-300 group-hover:translate-x-2">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-16 flex justify-center">
                    <Link
                        to="/collections"
                        className="px-10 py-3 bg-gray-900 text-white text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-black transition-all duration-300"
                    >
                        View all
                    </Link>
                </div>
            </div>
        </section>
    );
}
