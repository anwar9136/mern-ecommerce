import React from 'react';
import { Link } from 'react-router-dom';

const blogPosts = [
    {
        id: 1,
        title: "Kaisori discovers : Rediscovering elegance of C...",
        date: "MAY 19, 2025",
        excerpt: "Can a handmade saree be more than just clothing—perhaps a story of heritage, craftsmanship, and connection? Kaisori's Meher Chikankari collection explores the delicate art of Lucknow's Chikan embroidery on airy...",
        image: "https://kaisori.com/cdn/shop/articles/KAISORI_PANNA_MEHER_IMAGE_003_44d2356b-3aa4-419c-b670-d520e5ccf324.jpg?v=1747663255&width=1500",
    },
    {
        id: 2,
        title: "Kaisori discovers : The gorgeous Batiks of Bher...",
        date: "MAY 9, 2023",
        excerpt: "Embark on a journey with Kaisori as she uncovers the mesmerizing world of Batiks in the quaint village of Bherugarh. Known for its rich cultural heritage and exquisite craftsmanship, Bherugarh...",
        image: "https://kaisori.com/cdn/shop/articles/SRI01696_1.jpg?v=1739262998",
    },
    {
        id: 3,
        title: "The art of Bundi miniature paintings",
        date: "MAY 17, 2021",
        excerpt: "Bundi miniature painting is an important school of the Rajasthani style of Indian miniature painting that originated in the princely state of Bundi, located between Jaipur and Udaipur. The paintng stye...",
        image: "https://kaisori.com/cdn/shop/articles/The-art-of-Bundi-miniature-paintings-Kaisori-1179.jpg?v=1703207937",
    }
];

const LatestBlogs = () => {
    return (
        <section className="bg-white py-10 px-4 sm:px-6 lg:px-8 border-t border-gray-50">
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif text-gray-900 mb-4 font-light tracking-widest uppercase">
                        Our Blog
                    </h2>
                    <div className="w-24 h-[1px] bg-amber-800/20 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {blogPosts.map((post) => (
                        <div key={post.id} className="group cursor-pointer">
                            <div className="aspect-[1.5/1] overflow-hidden bg-gray-50 mb-6 rounded-sm border border-gray-100/50 shadow-sm transition-shadow hover:shadow-md">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] text-amber-800/60 font-bold uppercase tracking-[0.2em]">
                                    {post.date}
                                </p>
                                <h3 className="text-lg font-serif text-gray-900 group-hover:text-amber-800 transition-colors leading-tight">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-2 font-light">
                                    {post.excerpt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/blog"
                        className="inline-block px-12 py-4 border border-gray-900 text-gray-900 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-gray-900 hover:text-white transition-all duration-500 rounded-sm shadow-sm hover:shadow-xl active:scale-95"
                    >
                        View All Posts
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default LatestBlogs;
