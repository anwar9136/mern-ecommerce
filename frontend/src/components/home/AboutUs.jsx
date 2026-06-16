import React from 'react';

const AboutUs = () => {
    return (
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[800px] mx-auto">
                {/* Section Title */}
                <h1 className="text-5xl font-serif text-gray-900 mb-12 font-light">About us</h1>

                {/* Mission Statement */}
                <div className="space-y-8 text-gray-700 leading-relaxed text-[15px] font-light tracking-wide">
                    <p className="font-bold text-gray-900 italic">
                        "Preserving traditional craftsmanship while creating contemporary fashion that celebrates the stories and skills of artisans."
                    </p>

                    <p>
                        Kaisori is a collective journey into the heart of India's handcrafted marvels, bringing their magic into modern cities for you to rediscover a love for all things handmade. Our mission is to bridge the gap between the artisan and the consumer by offering products that invite you to touch, feel, and experience the artistry of India's craft traditions.
                    </p>

                    <p>
                        Each piece in our collection is ethically created, embodying the labor of love poured into it by skilled artisans over days, weeks, or even months. Our products resonate with consumers who value meaningful, sustainable choices and seek to make handmade craftsmanship a part of their lifestyle.
                    </p>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-gray-100 my-16"></div>

                {/* Image Placeholder 1 */}
                <div className="w-full aspect-[16/9] bg-gray-50 mb-16 flex items-center justify-center border border-gray-100 italic text-gray-400 text-sm">
                    Image: Artisans group photo placeholder
                </div>

                {/* Detailed Story Section */}
                <div className="space-y-12 text-gray-700 leading-relaxed text-[15px] font-light tracking-wide">
                    <div className="space-y-6">
                        <p>
                            The crafts of India are diverse, rich in history, culture and religion. We love all aspects of Indian handicrafts that are a perfect example of sustainable and an earthy lifestyle hand-made by our master artisans.
                        </p>
                        <p>
                            Romancing folk Indian arts inspired me to support the cause of handicrafts and revive their beautiful culture across the urban landscapes of India. We are fiercely passionate to make India re-discover their love for art, organic products, textiles and craftsmanship.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <p className="font-medium text-gray-900 mb-2">1. Our story is "LOVEHANDMADE"</p>
                            <p>All Kaisori products are completely handcrafted without using any machines. We work with natural dyes and all natural materials that support ancillary groups to create an overall sustainability story.</p>
                        </div>

                        <div>
                            <p className="font-medium text-gray-900 mb-2">2. Our story of sustainability is rooted at a grass-root level</p>
                            <p>We believe in creating constant work and growth for those at the grass-root level - the Artisans, to make this an honest venture. The idea is bridge the gap between two ends of the spectrum - the maker and the consumer. They can touch, feel and experience the magic of India through our crafts led lifestyle initiate.</p>
                        </div>
                    </div>
                </div>

                {/* Image Placeholder 2 */}
                <div className="w-full aspect-[16/9] bg-gray-50 my-16 flex items-center justify-center border border-gray-100 italic text-gray-400 text-sm">
                    Image: Weaving process placeholder
                </div>

                {/* Points 3-5 */}
                <div className="space-y-12 text-gray-700 leading-relaxed text-[15px] font-light tracking-wide">
                    <div>
                        <p className="font-medium text-gray-900 mb-2">3. Product Categories & Growth</p>
                        <p>We work with several categories - apparel, accessories, shoes, home, jewellery, beauty and art decor. Currently working with about 50 odd groups to support continuous growth through constant circulation of work. We believe in growing together and the only way to achieve this is to create new opportunities for them. Our sustainable LIVESLOW story is all about a lifestyle that combines the impact of crafts every day in everything that we consume - wear, do, eat and use.</p>
                    </div>
                </div>

                {/* Image Placeholder 3 */}
                <div className="w-full aspect-[16/9] bg-gray-50 my-16 flex items-center justify-center border border-gray-100 italic text-gray-400 text-sm">
                    Image: Artisan at work placeholder
                </div>

                <div className="space-y-12 text-gray-700 leading-relaxed text-[15px] font-light tracking-wide">
                    <div className="space-y-8">
                        <div>
                            <p className="font-medium text-gray-900 mb-2">4. Fair Wages & Responsibility</p>
                            <p>All artisans are paid upfront on a periodic basis with no burden of carrying any stock. We take complete responsibility and ownership to create a market for their product stories. Their wages are determined by them as per the orders and the time consumed on the total production.</p>
                        </div>

                        <div>
                            <p className="font-medium text-gray-900 mb-2">5. Respectful Timelines</p>
                            <p>No artisans are under pressure for any delivery. We do accept delays if at all and plan production timelines as per their convenience. Our relationship is humane. We work as a cohesive unit to develop our stories.</p>
                        </div>
                    </div>
                </div>

                {/* Image Placeholder 4 */}
                <div className="w-full aspect-[16/9] bg-gray-50 my-16 flex items-center justify-center border border-gray-100 italic text-gray-400 text-sm">
                    Image: Workshop placeholder
                </div>

                <div className="space-y-12 text-gray-700 leading-relaxed text-[15px] font-light tracking-wide">
                    <div>
                        <p className="font-medium text-gray-900 mb-2">6. Mindful Consumption</p>
                        <p>Mindful consumption, creation and usage are not new to them. They are equally conscious of how they work, where they work and how it impacts the environment.</p>
                    </div>

                    <p className="text-gray-900 font-serif italic text-lg text-center pt-8 border-t border-gray-50">
                        When you buy an handmade product, you buy an artisan's labour of love put together over many days, weeks or months.
                    </p>
                </div>

                {/* Image Placeholder 5 */}
                <div className="w-full aspect-[16/9] bg-gray-50 mt-16 flex items-center justify-center border border-gray-100 italic text-gray-400 text-sm">
                    Image: Block printing placeholder
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
