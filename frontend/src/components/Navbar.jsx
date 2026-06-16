import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiChevronDown, FiX } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaYoutube, FaPinterestP } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getCategories, getProducts } from '../services/api';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isSearchClosing, setIsSearchClosing] = useState(false);
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();
    const searchRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        fetchCategories();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Search functionality
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await getProducts({ search: query });
            setSearchResults(response.data || []);
            setShowSearchDropdown(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Debounce search
        searchTimeoutRef.current = setTimeout(() => {
            handleSearch(value);
        }, 300);
    };

    const popularSearches = ['maheshwari', 'malhar saree', 'batik', 'natural dyed'];

    const closeSearch = () => {
        setIsSearchClosing(true);
        setTimeout(() => {
            setSearchQuery('');
            setSearchResults([]);
            setShowSearchDropdown(false);
            setIsSearchActive(false);
            setIsSearchClosing(false);
        }, 250);
    };

    const openSearch = () => {
        setIsSearchActive(true);
    };

    // Filter categories by section
    const sareeCategories = categories?.filter(cat => (cat.section || 'saree') === 'saree') || [];
    const artisanalCategories = categories?.filter(cat => cat.section === 'artisanal') || [];

    // Helpers for Saree Section
    const sareeTopLevel = sareeCategories.filter(cat => !cat.parent);
    const getSareeChildren = (parentId) => sareeCategories.filter(cat => (cat.parent?._id || cat.parent) === parentId);

    return (
        <>
            <header className={`w-full z-[1000] transition-all duration-500 ${isScrolled ? 'fixed top-0 left-0 bg-white/95 backdrop-blur-sm shadow-sm' : 'relative bg-white'}`}>
                {/* Top Bar: Social Icons */}
                {!isScrolled && (
                    <div className="w-full border-b border-gray-100 py-2">
                        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-center space-x-6 text-gray-400 text-[12px]">
                            <a href="#" className="hover:text-black transition-colors"><FaFacebookF /></a>
                            <a href="#" className="hover:text-black transition-colors"><FaInstagram /></a>
                            <a href="#" className="hover:text-black transition-colors"><FaYoutube /></a>
                            <a href="#" className="hover:text-black transition-colors"><FaPinterestP /></a>
                        </div>
                    </div>
                )}

                {/* Main Navbar */}
                <div className={`w-full transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                        {isSearchActive ? (
                            /* Search Overlay Mode */
                            <div ref={searchRef} className={`w-full flex items-center gap-6 relative h-[65px] ${isSearchClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
                                <div className="flex-1 relative">
                                    <label className="absolute -top-3 left-3 bg-white px-1 text-[10px] text-gray-400 uppercase tracking-wider">Search</label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchInput}
                                        onFocus={() => searchQuery && setShowSearchDropdown(true)}
                                        autoFocus
                                        className="w-full px-4 py-3 text-base border border-gray-300 bg-white focus:outline-none focus:border-gray-600 transition-all duration-300"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
                                        >
                                            ×
                                        </button>
                                    )}
                                    <FiSearch className="text-gray-600" size={18} />
                                    <button
                                        onClick={closeSearch}
                                        className="text-gray-600 hover:text-black transition-colors ml-2"
                                    >
                                        <FiX size={22} />
                                    </button>
                                </div>

                                {/* Search Dropdown */}
                                {showSearchDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl border border-gray-100 rounded-md z-[2000] max-h-[500px] overflow-hidden">
                                        <div className="grid grid-cols-2 divide-x divide-gray-100">
                                            {/* Left: Suggestions */}
                                            <div className="p-6">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Suggestions</h3>
                                                <div className="space-y-3">
                                                    {searchQuery ? (
                                                        <div className="space-y-2">
                                                            {popularSearches
                                                                .filter(term => term.toLowerCase().includes(searchQuery.toLowerCase()))
                                                                .slice(0, 5)
                                                                .map((term, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => {
                                                                            setSearchQuery(term);
                                                                            handleSearch(term);
                                                                        }}
                                                                        className="block w-full text-left text-sm text-gray-600 hover:text-amber-800 transition-colors py-1"
                                                                    >
                                                                        <span className="font-medium">{term.substring(0, searchQuery.length)}</span>
                                                                        {term.substring(searchQuery.length)}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {popularSearches.map((term, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => {
                                                                        setSearchQuery(term);
                                                                        handleSearch(term);
                                                                    }}
                                                                    className="block w-full text-left text-sm text-gray-600 hover:text-amber-800 transition-colors py-1"
                                                                >
                                                                    {term}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {searchQuery && (
                                                    <Link
                                                        to={`/products?search=${searchQuery}`}
                                                        onClick={closeSearch}
                                                        className="block mt-6 text-xs text-gray-500 hover:text-amber-800 transition-colors"
                                                    >
                                                        Search for "{searchQuery}" →
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Right: Products */}
                                            <div className="p-6">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Products</h3>
                                                {isSearching ? (
                                                    <div className="flex justify-center items-center h-32">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-800"></div>
                                                    </div>
                                                ) : searchResults.length > 0 ? (
                                                    <div className="space-y-3 max-h-[380px] overflow-y-auto no-scrollbar pr-2">
                                                        {searchResults.slice(0, 10).map((product) => (
                                                            <Link
                                                                key={product._id}
                                                                to={`/product/${product.slug}`}
                                                                onClick={closeSearch}
                                                                className="flex gap-3 hover:bg-gray-50 p-2 rounded transition-colors group"
                                                            >
                                                                <img
                                                                    src={product.images[0]?.url || product.images[0] || 'https://via.placeholder.com/60'}
                                                                    alt={product.title}
                                                                    className="w-16 h-16 object-cover rounded"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900 group-hover:text-amber-800 transition-colors line-clamp-2 mb-1">
                                                                        {product.title}
                                                                    </p>
                                                                    <div className="flex items-center gap-2">
                                                                        {product.salePrice && product.salePrice < product.price ? (
                                                                            <>
                                                                                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                                                                                <span className="text-sm font-bold text-gray-900">₹{product.salePrice}</span>
                                                                            </>
                                                                        ) : (
                                                                            <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : searchQuery ? (
                                                    <p className="text-sm text-gray-400 text-center py-8">No products found</p>
                                                ) : (
                                                    <p className="text-sm text-gray-400 text-center py-8">Start typing to search</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Normal Navbar Mode */
                            <div className="flex items-center justify-between">
                                {/* Logo Section */}
                                <Link to="/" className="flex flex-col items-center flex-shrink-0 group">
                                    <div className={`transition-all duration-500 ${isScrolled ? 'w-[65px]' : 'w-[85px]'} h-auto`}>
                                        <img
                                            src="https://kaisori.com/cdn/shop/files/Logo_dc4100fe-ee81-4133-bb6d-1350cfe73baa.png?v=1733843730&width=135"
                                            alt="Kaisori"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </Link>

                                {/* Navigation Links */}
                                <nav className="hidden lg:flex items-center space-x-8 text-[11px] font-bold text-gray-800 uppercase tracking-widest self-stretch">
                                    <Link to="/our-story" className={`hover:text-amber-800 transition-colors ${location.pathname === '/our-story' ? 'border-b-2 border-amber-800' : ''}`}>Our Story</Link>
                                    <Link to="/founder" className={`hover:text-amber-800 transition-colors ${location.pathname === '/founder' ? 'border-b-2 border-amber-800' : ''}`}>Meet the Founder</Link>

                                    {/* Shop Saree Mega Menu */}
                                    <div className="group cursor-pointer flex items-center hover:text-amber-800 transition-colors h-full py-2">
                                        <span>Shop Saree</span>
                                        <FiChevronDown className="ml-1 text-[12px] group-hover:rotate-180 transition-transform duration-300" />

                                        {/* Mega Menu Dropdown */}
                                        <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[2000] p-10">
                                            <div className="grid grid-cols-5 gap-2">
                                                {sareeTopLevel?.length > 0 ? (
                                                    sareeTopLevel.slice(0, 5).map(parent => (
                                                        <div key={parent._id} className="space-y-6">
                                                            <Link
                                                                to={`/category/${parent.slug}`}
                                                                className={`inline-block max-w-[180px] leading-relaxed text-[12px] font-black text-gray-900 uppercase tracking-[0.1em] pb-2 hover:text-amber-800 transition-all ${location.pathname === `/category/${parent.slug}` ? 'border-b-2 border-amber-800' : ''}`}
                                                            >
                                                                {parent.name}
                                                            </Link>
                                                            <ul className="space-y-3">
                                                                {getSareeChildren(parent._id).map(child => (
                                                                    <li key={child._id}>
                                                                        <Link
                                                                            to={`/category/${child.slug}`}
                                                                            className={`text-gray-500 hover:text-amber-800 transition-colors text-[11px] font-bold uppercase tracking-widest inline-block max-w-[160px] leading-relaxed py-0.5 ${location.pathname === `/category/${child.slug}` ? 'border-b-2 border-amber-800 text-amber-800' : ''}`}
                                                                        >
                                                                            {child.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-span-full text-center text-gray-400 py-16 italic font-medium">
                                                        No saree categories available.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Artisanal Finds Mega Menu */}
                                    <div className="group cursor-pointer flex items-center hover:text-amber-800 transition-colors h-full py-2">
                                        <span>Artisanal Finds</span>
                                        <FiChevronDown className="ml-1 text-[12px] group-hover:rotate-180 transition-transform duration-300" />

                                        {/* Artisanal Dropdown */}
                                        <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[2000] p-10">
                                            <div className="flex flex-col items-start gap-4">
                                                {artisanalCategories?.length > 0 ? (
                                                    artisanalCategories.slice(0, 10).map(cat => (
                                                        <div key={cat._id}>
                                                            <Link
                                                                to={`/category/${cat.slug}`}
                                                                className={`block leading-relaxed text-[12px] font-black text-gray-900 uppercase tracking-[0.1em] hover:text-amber-800 transition-all ${location.pathname === `/category/${cat.slug}` ? 'border-b-2 border-amber-800' : ''}`}
                                                            >
                                                                {cat.name}
                                                            </Link>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center text-gray-400 py-4 italic font-medium w-full">
                                                        No artisanal categories available.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Link to="/products?view=bestsellers" className={`hover:text-amber-800 transition-colors ${location.pathname === '/products' && location.search.includes('bestsellers') ? 'border-b-2 border-amber-800' : ''}`}>Bestsellers</Link>
                                    <Link to="/blog" className={`hover:text-amber-800 transition-colors ${location.pathname === '/blog' ? 'border-b-2 border-amber-800' : ''}`}>Our Blog</Link>
                                </nav>

                                {/* Action Icons */}
                                <div className="flex items-center space-x-5 text-gray-700 text-[18px]">
                                    <button onClick={openSearch} className="hover:text-amber-800 transition-colors"><FiSearch /></button>
                                    {user ? (
                                        <div className="relative group">
                                            <button className="hover:text-amber-800 transition-colors flex items-center">
                                                <FiUser />
                                            </button>
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1001]">
                                                <div className="px-4 py-2 border-b border-gray-50">
                                                    <p className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">{user.name}</p>
                                                    <p className="text-[10px] text-gray-400 lowercase truncate">{user.email}</p>
                                                </div>
                                                {user.role === 'admin' && (
                                                    <Link to="/admin" className="block px-4 py-2 text-[11px] uppercase font-bold tracking-widest text-indigo-600 hover:bg-gray-50 transition-colors">Admin Panel</Link>
                                                )}
                                                <Link to="/orders" className="block px-4 py-2 text-[11px] uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-amber-800 transition-colors">My Orders</Link>
                                                <button
                                                    onClick={logout}
                                                    className="w-full text-left px-4 py-2 text-[11px] uppercase tracking-widest text-rose-600 hover:bg-gray-50 transition-colors"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link to="/login" className="hover:text-amber-800 transition-colors"><FiUser /></Link>
                                    )}
                                    <Link to="/cart" className="hover:text-amber-800 transition-colors relative">
                                        <FiShoppingBag />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </header>
            {/* Dark overlay when search is active */}
            {isSearchActive && (
                <div
                    className={`fixed inset-0 bg-black/50 z-[999] ${isSearchClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
                    onClick={closeSearch}
                />
            )}
        </>
    );
}
