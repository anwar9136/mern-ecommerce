import React from 'react';

const MeetTheFounder = () => {
    return (
        <section className="bg-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[800px] mx-auto text-left">
                {/* Section Title */}
                <h1 className="text-5xl font-serif text-gray-900 mb-12 font-light tracking-tight">Meet the Founder</h1>

                {/* Founder Image */}
                <div className="max-w-[600px] mx-auto mb-16 overflow-hidden rounded-sm border border-gray-50 shadow-sm">
                    <img
                        src="https://cdn.shopify.com/s/files/1/2564/8298/files/472136662_10170860171855355_7531628710935063106_n_480x480.jpg?v=1736086445"
                        alt="Emily Chakraborty - Founder of Kaisori"
                        className="w-full h-auto block"
                    />
                </div>

                {/* Narrative Content */}
                <div className="space-y-8 text-gray-700 leading-relaxed text-[15px] font-light tracking-wide">
                    <p>
                        Emily Chakraborty embraced her many passions—music, dance, art, and films—before choosing advertising as her career path. After a decade at Ogilvy Bangalore, where she managed major brands, Emily took a bold step to follow her heart and founded <span className="font-bold text-gray-900">Kaisori</span>, a platform dedicated to discovering, reviving, and uniting traditional crafts from across India. A handloom evangelist, trained Kathak dancer, and avid painter, she continues to channel her creative spirit into her work and art.
                    </p>

                    <p>
                        Emily finds her collaboration with artisans to be a deeply fulfilling journey, describing it as much more than just work. She takes pride in helping artisans from diverse regions showcase and sell their creations, offering them a platform to thrive. Her interactions with these grounded and skilled craftsmen have given her a fresh perspective on life—one that values simplicity, authenticity, and sustainability.
                    </p>

                    <p>
                        She feels that working with artisans has opened her eyes to a reality untouched by modern inequalities and biases. "Education and 'culture,' as we perceive them today, often make people judgmental and create divides," she says. In contrast, the artisans she collaborates with—those who spin the wheel, craft with their hands, and create beauty using natural dyes—embody empowerment in its truest sense. For them, sustainability is not a trend but a way of life—a fundamental value that inspires her every day.
                    </p>

                    <p>
                        For Emily, this journey has been a profound learning experience, teaching her lessons that no formal education or job ever could. It is this sense of purpose and connection that fuels her passion for Kaisori and her belief in the beauty of handmade products.
                    </p>

                    <p className="font-bold text-gray-900 pt-4">
                        #LoveHandmade
                    </p>
                </div>
            </div>
        </section>
    );
};

export default MeetTheFounder;
