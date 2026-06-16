import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const [userData, setUserData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup(userData);
        if (success) navigate('/');
    };

    return (
        <div className="h-screen flex items-center justify-center bg-[#FAF9F6] overflow-hidden font-sans">
            <div className="max-w-md w-full space-y-8 px-4">
                <div className="flex justify-center">
                    <Link to="/">
                        <img
                            src="https://kaisori.com/cdn/shop/files/Logo_dc4100fe-ee81-4133-bb6d-1350cfe73baa.png?v=1733843730&width=135"
                            alt="Kaisori"
                            className="w-[100px] h-auto"
                        />
                    </Link>
                </div>

                <div className="bg-white p-8 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-100/50 rounded-2xl">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create account</h2>
                        <p className="mt-2 text-[15px] text-gray-500 font-normal">
                            Join us or sign in to your account
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    required
                                    className="appearance-none relative block w-full px-4 py-4 border border-gray-200 bg-white placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A31F4]/10 focus:border-[#5A31F4] transition-all sm:text-sm"
                                    placeholder="Full Name"
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    required
                                    className="appearance-none relative block w-full px-4 py-4 border border-gray-200 bg-white placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A31F4]/10 focus:border-[#5A31F4] transition-all sm:text-sm"
                                    placeholder="Email address"
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="appearance-none relative block w-full px-4 py-4 pr-12 border border-gray-200 bg-white placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A31F4]/10 focus:border-[#5A31F4] transition-all sm:text-sm"
                                    placeholder="Password"
                                    value={userData.password}
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-4 px-4 bg-[#5A31F4] text-white text-[16px] font-bold rounded-xl hover:bg-[#4a28cc] focus:outline-none transition-all duration-500 shadow-lg active:scale-[0.98]"
                            >
                                Create account with shop
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-8 pt-6 border-t border-gray-50">
                        <p className="text-sm text-gray-400">
                            Already have an account?
                            <Link to="/login" className="ml-2 font-bold text-[#5A31F4] hover:underline">Login here</Link>
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center mx-auto"
                    >
                        <span className="mr-2">←</span> Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}
