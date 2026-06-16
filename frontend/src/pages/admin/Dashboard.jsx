import { useState, useEffect } from 'react';
import {
    Users,
    Package,
    ShoppingCart,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { getProducts, getCategories, getAllOrders } from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        orders: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, categoriesRes, ordersRes] = await Promise.all([
                    getProducts(),
                    getCategories(),
                    getAllOrders()
                ]);

                const totalRevenue = ordersRes.data.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

                setStats({
                    products: productsRes.data.length,
                    categories: categoriesRes.data.length,
                    orders: ordersRes.data.length,
                    revenue: totalRevenue
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { name: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-500', trend: '+12%', trendUp: true },
        { name: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-purple-500', trend: '+5%', trendUp: true },
        { name: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-500', trend: '+18%', trendUp: true },
        { name: 'Categories', value: stats.categories, icon: Users, color: 'bg-orange-500', trend: 'Stable', trendUp: null },
    ];

    if (loading) {
        return <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-xl text-white`}>
                                <stat.icon size={24} />
                            </div>
                            {stat.trendUp !== null && (
                                <div className={`flex items-center text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.trend}
                                    {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                </div>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Placeholder */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <Clock size={20} className="text-indigo-600" />
                            Recent Orders
                        </h3>
                        <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-gray-500 text-center py-8 italic">Order history integration coming soon...</p>
                    </div>
                </div>

                {/* Top Products Placeholder */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <TrendingUp size={20} className="text-indigo-600" />
                            Top Categories
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-gray-500 text-center py-8 italic">Category analytics integration coming soon...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
