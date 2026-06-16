import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaPinterestP } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';

export default function Footer() {
    const [comingSoonModal, setComingSoonModal] = useState(false);
    const [comingSoonPage, setComingSoonPage] = useState('');

    const handleComingSoon = (pageName) => {
        setComingSoonPage(pageName);
        setComingSoonModal(true);
        setTimeout(() => setComingSoonModal(false), 2000);
    };

    return (
        <>
            <footer className="bg-[#f9f9f9] pt-20 pb-10 border-t border-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                        {/* Contact Us Section */}
                        <div>
                            <h4 className="text-[15px] font-bold text-gray-900 uppercase tracking-widest mb-8">Contact us</h4>
                            <div className="space-y-6 text-[14px] text-gray-600 leading-relaxed font-light">
                                <p>
                                    Click on the Green WhatsApp button on the bottom left of the page to chat with us.
                                    We're available from Monday to Friday 10am - 6pm IST
                                </p>
                                <div className="space-y-2">
                                    <p>Customer care: <a href="tel:+919984042996" className="underline hover:text-amber-800 transition-colors">+91 9984042996</a></p>
                                    <p>Email: <a href="mailto:kaisoriorders@gmail.com" className="underline hover:text-amber-800 transition-colors">kaisoriorders@gmail.com</a></p>
                                </div>
                            </div>
                        </div>

                        {/* Company Section */}
                        <div>
                            <h4 className="text-[15px] font-bold text-gray-900 uppercase tracking-widest mb-8">Company</h4>
                            <ul className="space-y-4 text-[14px] text-gray-600 font-light">
                                <li><Link to="/our-story" className="hover:text-amber-800 transition-colors">About us</Link></li>
                                <li><button onClick={() => handleComingSoon('In the News')} className="hover:text-amber-800 transition-colors">In the News</button></li>
                                <li><Link to="/blog" className="hover:text-amber-800 transition-colors">Blog</Link></li>
                                <li><button onClick={() => handleComingSoon('Privacy Policy')} className="hover:text-amber-800 transition-colors">Privacy Policy</button></li>
                                <li><button onClick={() => handleComingSoon('Contact')} className="hover:text-amber-800 transition-colors">Contact us</button></li>
                            </ul>
                        </div>

                        {/* Customer Section */}
                        <div>
                            <h4 className="text-[15px] font-bold text-gray-900 uppercase tracking-widest mb-8">Customer</h4>
                            <ul className="space-y-4 text-[14px] text-gray-600 font-light">
                                <li><button onClick={() => handleComingSoon('Shipping')} className="hover:text-amber-800 transition-colors">Shipping</button></li>
                                <li><button onClick={() => handleComingSoon('Garment Care')} className="hover:text-amber-800 transition-colors">Garment care</button></li>
                                <li><button onClick={() => handleComingSoon('Terms of Service')} className="hover:text-amber-800 transition-colors">Terms of service</button></li>
                                <li><button onClick={() => handleComingSoon('Returns Policy')} className="hover:text-amber-800 transition-colors">Returns and Refund policy</button></li>
                                <li><button onClick={() => handleComingSoon('FAQ')} className="hover:text-amber-800 transition-colors">FAQ</button></li>
                            </ul>
                        </div>

                        {/* Collections Section */}
                        <div>
                            <h4 className="text-[15px] font-bold text-gray-900 uppercase tracking-widest mb-8">Collections</h4>
                            <ul className="space-y-4 text-[14px] text-gray-600 font-light">
                                <li><Link to="/collections" className="hover:text-amber-800 transition-colors">All collections</Link></li>
                                <li><Link to="/products" className="hover:text-amber-800 transition-colors">Browse Products</Link></li>
                                <li><Link to="/products?view=bestsellers" className="hover:text-amber-800 transition-colors">Bestsellers</Link></li>
                                <li><button onClick={() => handleComingSoon('Handloom Weaves')} className="hover:text-amber-800 transition-colors">Handloom weaves</button></li>
                                <li><button onClick={() => handleComingSoon('Handblockprinted Sarees')} className="hover:text-amber-800 transition-colors">Handblockprinted sarees</button></li>
                                <li><button onClick={() => handleComingSoon('Jewellery & Accessories')} className="hover:text-amber-800 transition-colors">Jewellery & Accessories</button></li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter and Socials */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pb-12 border-b border-gray-200">
                        <div className="w-full lg:w-1/3">
                            <h4 className="text-[15px] font-bold text-gray-900 uppercase tracking-widest mb-6">Subscribe to our emails</h4>
                            <div className="relative border border-gray-400 group focus-within:border-gray-900 transition-colors">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full py-4 pl-4 pr-12 bg-transparent text-[14px] text-gray-800 focus:outline-none placeholder:text-gray-400"
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors">
                                    <HiOutlineArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex space-x-6 text-gray-800">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition-colors"><FaFacebookF size={18} /></a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition-colors"><FaInstagram size={18} /></a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition-colors"><FaYoutube size={18} /></a>
                            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition-colors"><FaPinterestP size={18} /></a>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-10 flex flex-col md:flex-row justify-center items-center text-[12px] text-gray-500 font-light space-y-4 md:space-y-0 md:space-x-1">
                        <p>© 2026, Kaisori</p>
                        <span className="hidden md:inline">·</span>
                        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                            <button onClick={() => handleComingSoon('Refund Policy')} className="hover:underline">Refund policy</button>
                            <span className="md:hidden">·</span>
                            <button onClick={() => handleComingSoon('Privacy Policy')} className="hover:underline">Privacy policy</button>
                            <span className="md:hidden">·</span>
                            <button onClick={() => handleComingSoon('Terms of Service')} className="hover:underline">Terms of service</button>
                            <span className="md:hidden">·</span>
                            <button onClick={() => handleComingSoon('Shipping Policy')} className="hover:underline">Shipping policy</button>
                            <span className="md:hidden">·</span>
                            <button onClick={() => handleComingSoon('Contact Information')} className="hover:underline">Contact information</button>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Coming Soon Toast */}
            {comingSoonModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
                    <div className="bg-black text-white px-8 py-4 rounded-lg shadow-2xl animate-fadeIn">
                        <p className="text-center font-medium">{comingSoonPage}</p>
                        <p className="text-center text-sm text-gray-300 mt-1">Coming Soon!</p>
                    </div>
                </div>
            )}
        </>
    );
}
