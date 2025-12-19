import { useState, useContext } from 'react';
import { User, Package, Settings, ChevronRight, Globe, LogOut, Moon, Sun, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import AuthContext from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatOrderDate } from '../utils/dateUtils';

const Profile = () => {
    const { theme, toggleTheme } = useTheme();
    const { language, t } = useLanguage();
    const { user, logout } = useContext(AuthContext);
    const { orders } = useData();
    const navigate = useNavigate();

    // Calculate real-time order statistics
    const totalOrders = orders.length;
    const processingOrders = orders.filter(order => order.status === 'Processing').length;
    const deliveredOrders = orders.filter(order => order.status === 'Delivered').length;
    const cancelledOrders = orders.filter(order => order.status === 'Cancelled').length;

    // Get most recent order
    const recentOrder = orders.length > 0 ? orders[0] : null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 py-8 md:py-12 transition-colors duration-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6 flex items-center gap-4 sm:gap-6 transition-colors duration-200">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 sm:p-4 rounded-full flex-shrink-0">
                        <User size={40} className="text-blue-600 dark:text-blue-400 sm:w-12 sm:h-12" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{user?.name || 'Guest User'}</h1>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 truncate">{user?.email || 'Not logged in'}</p>
                    </div>
                </div>

                {/* Order Dashboard */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 transition-colors duration-200">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Package className="text-blue-600 dark:text-blue-400" size={20} />
                            {t('Orders Dashboard')}
                        </h2>
                        <Link to="/orders" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">
                            {t('View All Orders')}
                        </Link>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalOrders}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">{t('Total Orders')}</p>
                            </div>
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{processingOrders}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">{t('Processing')}</p>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{deliveredOrders}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">{t('Delivered')}</p>
                            </div>
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{cancelledOrders}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">{t('Cancelled')}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            {recentOrder ? (
                                <Link to={`/orders/${recentOrder._id || recentOrder.id}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                                            <Package className="text-gray-400 dark:text-gray-500" size={24} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{t('Track your recent order')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                #{String(recentOrder._id || recentOrder.id).slice(-6).toUpperCase()} • {formatOrderDate(recentOrder.createdAt || recentOrder.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" size={20} />
                                </Link>
                            ) : (
                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('No orders yet')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* News & Offers */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 transition-colors duration-200">
                    <Link to="/news" className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                                <Globe className="text-pink-600 dark:text-pink-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('News & Offers')}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('Check out latest deals and updates')}</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" size={20} />
                    </Link>
                </div>

                {/* Admin Dashboard (Visible only to specific admin) */}
                {user && user.email === 'mohamedinamulhasan0@gmail.com' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 transition-colors duration-200">
                        <Link to="/admin" className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <Shield className="text-blue-600 dark:text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('Admin Dashboard')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('Manage products, stores, and users')}</p>
                                </div>
                            </div>
                            <ChevronRight className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" size={20} />
                        </Link>
                    </div>
                )}

                {/* Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Settings className="text-gray-600 dark:text-gray-400" size={20} />
                            {t('Settings')}
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {/* Appearance Toggle */}
                        <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={toggleTheme}>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    {theme === 'dark' ? (
                                        <Moon className="text-purple-600 dark:text-purple-400" size={20} />
                                    ) : (
                                        <Sun className="text-purple-600 dark:text-purple-400" size={20} />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{t('Appearance')}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {theme === 'dark' ? t('Dark Mode') : t('Light Mode')}
                                    </p>
                                </div>
                            </div>
                            <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 bg-gray-200 dark:bg-purple-600">
                                <span
                                    className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </div>
                        </div>



                        <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer text-red-600 dark:text-red-400" onClick={handleLogout}>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <LogOut className="text-red-600 dark:text-red-400" size={20} />
                                </div>
                                <p className="font-medium">{t('Sign Out')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
