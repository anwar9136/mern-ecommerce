import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { _id, title, price, salePrice, images, slug, stock } = product;
    const { addItem } = useCart();
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = async () => {
        const success = await addItem(_id, 1);
        if (success) {
            navigate('/cart');
        }
    };

    // Get the primary and hover images
    const primaryImage = (images?.[0]?.url || images?.[0]) || 'https://via.placeholder.com/400x500';
    const hoverImage = (images?.[1]?.url || images?.[1]) || primaryImage;

    return (
        <div className="group flex flex-col bg-white overflow-hidden transition-all duration-300">
            {/* Product Image Container */}
            <div
                className="relative w-full aspect-[4/5] overflow-hidden bg-white border border-gray-50"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Link to={`/product/${slug}`} className="block w-full h-full">
                    {/* Primary Image */}
                    <img
                        src={primaryImage}
                        alt={title}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && hoverImage !== primaryImage ? 'opacity-0' : 'opacity-100'
                            }`}
                    />
                    {/* Hover Image (only if different from primary) */}
                    {hoverImage !== primaryImage && (
                        <img
                            src={hoverImage}
                            alt={`${title} - alternate view`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
                                }`}
                        />
                    )}
                </Link>

                {/* Sale Tag - Bottom Left */}
                {salePrice && salePrice < price && (
                    <span className="absolute bottom-3 left-3 bg-black text-white text-[10px] uppercase px-3 py-1 font-bold tracking-widest rounded-full shadow-md z-10">
                        Sale
                    </span>
                )}

                {/* Cart Action - Bottom Right */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-3 right-3 h-9 w-9 bg-gray-600/90 hover:bg-black text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-20"
                    title="Quick Add to Bag"
                >
                    <FiShoppingBag size={16} />
                </button>
            </div>

            {/* Product Info */}
            <div className="mt-4 flex flex-col items-start px-1 space-y-1">
                <Link to={`/product/${slug}`} className="text-[13px] font-medium text-gray-800 hover:text-black line-clamp-1">
                    {title}
                </Link>

                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    KAISORI
                </span>


                <div className="flex items-center gap-2 pt-1">
                    {salePrice && salePrice < price ? (
                        <>
                            <span className="text-gray-400 line-through text-[11px] font-light">Rs. {price.toLocaleString()}</span>
                            <span className="text-gray-900 font-medium text-[12px]">From Rs. {salePrice.toLocaleString()}</span>
                        </>
                    ) : (
                        <span className="text-gray-900 font-medium text-[12px]">Rs. {price.toLocaleString()}</span>
                    )}
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                className="mt-4 w-full py-3 border border-gray-900 text-gray-900 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
                Add to cart
            </button>
        </div>
    );
}
