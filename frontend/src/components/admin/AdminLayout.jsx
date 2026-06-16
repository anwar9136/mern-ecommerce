import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingCart,
    LogOut,
    Menu,
    X,
    User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Saree Categories', href: '/admin/categories?section=saree', icon: Layers },
        { name: 'Artisanal Categories', href: '/admin/categories?section=artisanal', icon: Layers },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    ];

    const isActive = (path) => {
        if (path.includes('?')) {
            return location.pathname + location.search === path;
        }
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col fixed h-full z-30`}
            >
                <div className="p-6 flex items-center justify-between">
                    <h1 className={`${!isSidebarOpen && 'hidden'} font-bold text-xl text-indigo-600 truncate`}>
                        Admin Panel
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 rounded-lg hover:bg-gray-100"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-grow px-4 space-y-2 mt-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center p-3 rounded-xl transition-all ${isActive(item.href)
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className={`${!isSidebarOpen && 'hidden'} ml-3 font-medium`}>
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="flex items-center w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                    >
                        <LogOut size={20} />
                        <span className={`${!isSidebarOpen && 'hidden'} ml-3 font-medium`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} flex-grow transition-all duration-300`}>
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-800 capitalize">
                            {location.pathname.split('/').pop() || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
