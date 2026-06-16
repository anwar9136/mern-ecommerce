import React from 'react';

const blogPosts = [
    {
        id: 1,
        title: "Kaisori discovers : Rediscovering elegance of C...",
        date: "MAY 19, 2025",
        excerpt: "Can a handmade saree be more than just clothing—perhaps a story of heritage, craftsmanship, and connection? Kaisori's Meher Chikankari collection explores the delicate art of Lucknow's Chikan embroidery on airy...",
        image: "https://kaisori.com/cdn/shop/articles/KAISORI_PANNA_MEHER_IMAGE_003_44d2356b-3aa4-419c-b670-d520e5ccf324.jpg?v=1747663255&width=1500",
        link: "#"
    },
    {
        id: 2,
        title: "Kaisori discovers : The gorgeous Batiks of Bher...",
        date: "MAY 9, 2023",
        excerpt: "Embark on a journey with Kaisori as she uncovers the mesmerizing world of Batiks in the quaint village of Bherugarh. Known for its rich cultural heritage and exquisite craftsmanship, Bherugarh...",
        image: "https://kaisori.com/cdn/shop/articles/SRI01696_1.jpg?v=1739262998",
        comments: "3 comments",
        link: "#"
    },
    {
        id: 3,
        title: "The art of Bundi miniature paintings",
        date: "MAY 17, 2021",
        excerpt: "Bundi miniature painting is an important school of the Rajasthani style of Indian miniature painting that originated in the princely state of Bundi, located between Jaipur and Udaipur. The paintng stye...",
        image: "https://kaisori.com/cdn/shop/articles/The-art-of-Bundi-miniature-paintings-Kaisori-1179.jpg?v=1703207937",
        link: "#"
    },
    {
        id: 4,
        title: "Kaisori discovers : The art of Syahi Begar",
        date: "MARCH 19, 2021",
        excerpt: "Kaisori discovers : Modernising the Syahi Begar of Bagru .",
        image: "https://kaisori.com/cdn/shop/articles/Kaisori-discovers-The-art-of-Syahi-Begar-Kaisori-2831.jpg?v=1703207912&width=1500",
        link: "#"
    },
    {
        id: 5,
        title: "Kaisori discovers : The dabu block prints of Akola",
        date: "OCTOBER 27, 2020",
        excerpt: "Dive into the world of Dabu prints with our Akola cluster story, where every saree is a masterpiece of heritage and elegance. Let the rich traditions of Akola, Rajasthan, drape...",
        image: "https://kaisori.com/cdn/shop/articles/ZPM_7828_a29f76fb-634f-4f45-a87f-8b156059951e.jpg?v=1739263097&width=1500",
        comments: "2 comments",
        link: "#"
    },
    {
        id: 6,
        title: "Kaisori discovers : The tile makers of Athangudi",
        date: "JUNE 15, 2019",
        excerpt: "Kaisori discovers Athangudi tile making from Chettinad, Tamil Nadu. A 150 year old art-form that is known to produce absolutely the most beautiful handmade tiles from the region. Deft hands of...",
        image: "https://kaisori.com/cdn/shop/articles/Kaisori-discovers-The-tile-makers-of-Athangudi-Kaisori-2519.jpg?v=1703207896&width=1500",
        link: "#"
    }
];

const Blog = () => {
    return (
        <section className="bg-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1200px] mx-auto">
                {/* Page Title */}
                <h1 className="text-4xl font-serif text-gray-900 mb-16 font-light tracking-tight text-left">
                    Kaisori discovers
                </h1>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                    {blogPosts.map((post) => (
                        <div key={post.id} className="group cursor-pointer">
                            {/* Image Container */}
                            <div className="aspect-[1.5/1] overflow-hidden bg-gray-50 mb-6 rounded-sm border border-gray-100 shadow-sm">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Post Content */}
                            <div className="space-y-3">
                                <h2 className="text-2xl font-serif text-gray-900 group-hover:text-amber-800 transition-colors leading-tight">
                                    {post.title}
                                </h2>

                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                                    {post.date}
                                </p>

                                <p className="text-gray-600 text-[14px] leading-relaxed line-clamp-3 font-light">
                                    {post.excerpt}
                                </p>

                                {post.comments && (
                                    <p className="text-[11px] text-gray-400 italic pt-2">
                                        {post.comments}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;
