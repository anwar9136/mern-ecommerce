import { FaWhatsapp } from 'react-icons/fa';
import HeroSlider from '../components/home/HeroSlider';
import NewArrivals from '../components/home/NewArrivals';
import WatchAndBuy from '../components/home/WatchAndBuy';
import Bestsellers from '../components/home/Bestsellers';
import OurPromise from '../components/home/OurPromise';
import OurCollections from '../components/home/OurCollections';
import Reviews from '../components/home/Reviews';
import LatestBlogs from '../components/home/LatestBlogs';
import ScrollReveal from '../components/ScrollReveal';

export default function Home() {
    return (
        <div className="w-full bg-white selection:bg-amber-50">
            <HeroSlider />

            <ScrollReveal>
                <NewArrivals />
            </ScrollReveal>

            <ScrollReveal delay={100}>
                <WatchAndBuy />
            </ScrollReveal>

            <ScrollReveal delay={200}>
                <Bestsellers />
            </ScrollReveal>

            <ScrollReveal>
                <OurPromise />
            </ScrollReveal>

            <ScrollReveal>
                <OurCollections />
            </ScrollReveal>

            <ScrollReveal>
                <Reviews />
            </ScrollReveal>

            <ScrollReveal>
                <LatestBlogs />
            </ScrollReveal>

            {/* Premium Floating WhatsApp Button */}
            <a
                href="https://wa.me/yournumber"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-10 left-10 z-[100] bg-zinc-900 text-white p-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-110 hover:-translate-y-2 transition-all duration-500 group overflow-hidden"
            >
                <div className="relative z-10 flex items-center space-x-2">
                    <FaWhatsapp size={24} className="text-[#25D366]" />
                    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 text-[11px] font-bold tracking-widest uppercase">
                        Chat with us
                    </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
        </div>
    );
}
