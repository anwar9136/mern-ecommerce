import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const slides = [
    {
        url: "https://kaisori.com/cdn/shop/files/Untitled-5.png?v=1735108244&width=2000",
        title: "नर्मदा",
        subtitle: "NARMADA BATIK MAHESHWARI SAREES",
        button: "Explore Collection",
        link: "/category/batik-maheshwari-saree-narmada"
    },
    {
        url: "https://kaisori.com/cdn/shop/files/Untitled-1_3d2730d3-8813-48c6-babf-058a9c0eaad5.png?v=1735110773&width=2000",
        title: "बाग",
        subtitle: "BAGH - HANDBLOCKPRINTED SAREES",
        button: "View Collection",
        link: "/category/bagh-handblockprinted-sarees"
    },
    {
        url: "https://kaisori.com/cdn/shop/files/KAISORI_ANAR_AARZOO_IMAGE_007.jpg?v=1746441097&width=2000",
        title: "मेहर",
        subtitle: "MEHER - CHIKANKARI KOTA SAREES",
        button: "Shop Now",
        link: "/category/meher-chikankari-kota-sarees"
    },
    {
        url: "https://kaisori.com/cdn/shop/files/Untitled-6.png?v=1735109032&width=2000",
        title: "सहर",
        subtitle: "SEHER - HANDLOOM MAHESHWARI SAREES",
        button: "Discover",
        link: "/category/seher-handloom-maheshwari-sarees"
    },
    {
        url: "https://kaisori.com/cdn/shop/files/KOTA_LEHERIYA__AIRA_JAMUN_SAREE_009.jpg?v=1746509191&width=2000",
        title: "ऐरा",
        subtitle: "AIRA - LEHERIYA KOTA SAREES",
        button: "Shop Collection",
        link: "/category/aira-leheriya-kota-sarees"
    }
];

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 6000);
        return () => clearInterval(interval);
    }, [isPaused]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <section className="relative w-full h-[calc(100vh-140px)] min-h-[500px] overflow-hidden group">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <div
                        style={{ backgroundImage: `url(${slide.url})` }}
                        className="w-full h-full bg-cover bg-center"
                    />
                    {index === currentIndex && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/10">
                            <h1 className="text-6xl md:text-8xl font-serif mb-4 drop-shadow-lg">{slide.title}</h1>
                            <p className="text-sm md:text-base tracking-[0.3em] mb-10 font-bold drop-shadow-md">{slide.subtitle}</p>
                            <Link
                                to={slide.link}
                                className="px-12 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 uppercase text-[12px] tracking-[0.3em] font-bold rounded-sm"
                            >
                                {slide.button}
                            </Link>
                        </div>
                    )}
                </div>
            ))}

            {/* Controls Bar */}
            <div className="absolute bottom-0 w-full bg-white/95 backdrop-blur-sm border-t border-gray-100 py-4 flex items-center justify-center space-x-12 text-gray-600 z-50">
                <div className="flex items-center space-x-8">
                    <button onClick={prevSlide} className="hover:text-black transition p-1"><FiChevronLeft size={22} /></button>
                    <div className="flex items-baseline space-x-1 font-serif">
                        <span className="text-lg font-bold text-gray-900">{currentIndex + 1}</span>
                        <span className="text-gray-300 text-xs">/</span>
                        <span className="text-gray-400 text-xs">{slides.length}</span>
                    </div>
                    <button onClick={nextSlide} className="hover:text-black transition p-1"><FiChevronRight size={22} /></button>
                </div>
                <div className="h-6 w-[1px] bg-gray-200"></div>
                <button onClick={() => setIsPaused(!isPaused)} className="hover:text-black transition p-1">
                    {isPaused ? <FiPlay size={18} /> : <FiPause size={18} />}
                </button>
            </div>
        </section>
    );
}
