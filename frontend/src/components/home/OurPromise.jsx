export default function OurPromise() {
    const promises = [
        {
            title: "Supporting craftsmanship",
            description: "We committed to maintaining quality and offering products that are synonymous with authenticity and a deep connection to India's cultural and artisanal heritage.",
            image: "https://kaisori.com/cdn/shop/files/69e154dec1d8e9b192880215f26529f3.jpg?v=1735999926&width=500"
        },
        {
            title: "Celebrating handmade",
            description: "We celebrate handmade in all our products, such as handwoven textiles, hand block printing, and hand embroidery. We collaborate with over 30 artisan clusters across India, offering more than 500 handcrafted design.",
            image: "https://kaisori.com/cdn/shop/files/Untitled.png?v=1736087569&width=500"
        },
        {
            title: "Ethical sourcing and sustainability",
            description: "We use traditional techniques, natural non toxic dyes and natural materials to make products that have minimal environmental impact.",
            image: "https://kaisori.com/cdn/shop/files/Untitled_1.png?v=1738824035&width=500"
        }
    ];

    return (
        <section className="bg-white py-10 border-t border-gray-50">
            <div className="max-w-[1400px] mx-auto px-4">
                <h2 className="text-2xl font-serif text-gray-900 tracking-wide mb-10 px-4">Our promise</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
                    {promises.map((promise, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {/* Icon Image */}
                            <div className="mb-8 flex items-center justify-center">
                                <img
                                    src={promise.image}
                                    alt={promise.title}
                                    className="w-56 h-56 md:w-64 md:h-64 object-contain mix-blend-multiply"
                                />
                            </div>

                            {/* Content */}
                            <h3 className="text-[20px] font-semibold text-gray-900 mb-4 tracking-wide">
                                {promise.title}
                            </h3>
                            <p className="text-[16px] text-gray-600 leading-relaxed font-light px-4 max-w-[400px]">
                                {promise.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
