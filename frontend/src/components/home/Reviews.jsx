import { useState, useCallback, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

const reviews = [
    {
        id: 1,
        rating: 5,
        comment: "Very authentic",
        author: "Pragyasmita Sarkhel"
    },
    {
        id: 2,
        rating: 5,
        comment: "The most authentic and original saree I could gift to my mom. I'm extremely happy with the order and it was wonderful experience to wait and enjoy the authenticity of the product. Keep the good work going! All support...",
        author: "Sagar"
    },
    {
        id: 3,
        rating: 5,
        comment: "Leheriya Kota Sarees - Aira - Gulabo",
        author: "ritu mittal"
    },
    {
        id: 4,
        rating: 5,
        comment: "Quality and Service - The Narmada series is more than just fabric; it's a testament to patience. The batik work is so intricate, it feels like wearing a piece of history.",
        author: "Elena Rodriguez"
    },
    {
        id: 5,
        rating: 5,
        comment: "Beautiful Craft - The Bagh prints have a rhythm that speaks to the soul. Natural dyes that are soft on the skin and vibrant in their narrative.",
        author: "Ritu Vardhan"
    },
    {
        id: 6,
        rating: 5,
        comment: "Excellent Experience - Every thread tells a story. This isn't just a saree, it's a legacy I'll pass down. Exceptional quality and even more exceptional spirit.",
        author: "Sagarika Sen"
    }
];

export default function Reviews() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev >= reviews.length - 3 ? 0 : prev + 1));
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? reviews.length - 3 : prev - 1));
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    const StarRating = ({ rating }) => (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <FiStar
                    key={i}
                    size={14}
                    className={i < rating ? 'fill-black text-black' : 'text-gray-300'}
                />
            ))}
        </div>
    );

    return (
        <section
            className="bg-white py-10 overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div className="max-w-[1200px] mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-[15px] font-normal text-gray-900 mb-3">
                        Trusted and loved by 6,000+ wonderful women like you! ❤️
                    </h2>
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <StarRating rating={5} />
                    </div>
                    <p className="text-[11px] text-gray-500">from 1233 reviews</p>
                </div>

                {/* Reviews Slider */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-black transition-all hover:scale-110 border border-gray-100 hidden lg:flex items-center justify-center"
                        aria-label="Previous reviews"
                    >
                        <FiChevronLeft size={20} />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-black transition-all hover:scale-110 border border-gray-100 hidden lg:flex items-center justify-center"
                        aria-label="Next reviews"
                    >
                        <FiChevronRight size={20} />
                    </button>

                    {/* Review Cards Container */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
                        >
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="w-full md:w-1/3 flex-shrink-0 px-3"
                                >
                                    <div className="bg-gray-50 p-6 h-full border border-gray-100 rounded-sm">
                                        <div className="mb-3">
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <p className="text-[13px] text-gray-700 mb-4 line-clamp-4 leading-relaxed">
                                            {review.comment}
                                        </p>
                                        <p className="text-[11px] text-gray-900 font-medium">
                                            {review.author}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-2 mt-8">
                    {[...Array(reviews.length - 2)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setCurrentIndex(i);
                                setIsAutoPlaying(false);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'bg-black w-8' : 'bg-gray-300 w-1.5 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
