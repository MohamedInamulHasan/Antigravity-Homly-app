import { useState } from 'react';
import { User, Package, Settings, ChevronRight, Globe, LogOut, Moon, Sun, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6 flex items-center gap-6 transition-colors duration-200">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full flex-shrink-0">
                        <User size={48} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">John Doe</h1>
                        <p className="text-gray-500 dark:text-gray-400">john.doe@example.com</p>
                    </div>
                </div>

                {/* Order Dashboard */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 transition-colors duration-200">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Package className="text-blue-600 dark:text-blue-400" size={20} />
                            Orders Dashboard
                        </h2>
                        <Link to="/orders" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">
                            View All Orders
                        </Link>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">Total Orders</p>
                            </div>
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">2</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">Processing</p>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">8</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">Delivered</p>
                            </div>
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">1</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">Returns</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Link to="/orders" className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                                        <Package className="text-gray-400 dark:text-gray-500" size={24} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Track your recent order</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">ORD-2024-001 • Nov 20, 2024</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" size={20} />
                            </Link>
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
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">News & Offers</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Check out latest deals and updates</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" size={20} />
                    </Link>
                </div>

                {/* Admin Dashboard (Visible only to Admins) */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 transition-colors duration-200">
                    <Link to="/admin" className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <Shield className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Manage products, stores, and users</p>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" size={20} />
                    </Link>
                </div>

                {/* Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Settings className="text-gray-600 dark:text-gray-400" size={20} />
                            Settings
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
                                    <p className="font-medium text-gray-900 dark:text-white">Appearance</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
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

                        <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={toggleLanguage}>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                    <Globe className="text-indigo-600 dark:text-indigo-400" size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Language</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{language === 'en' ? 'English' : 'Tamil'}</span>
                                <ChevronRight className="text-gray-400 dark:text-gray-500" size={18} />
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer text-red-600 dark:text-red-400">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <LogOut className="text-red-600 dark:text-red-400" size={20} />
                                </div>
                                <p className="font-medium">Sign Out</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
