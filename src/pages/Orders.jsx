import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Search, ChevronRight, Truck, CheckCircle, Clock, RotateCcw, ShoppingBag, Trash2, AlertTriangle, X, Store } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { formatOrderDateTime, formatDeliveryTime } from '../utils/dateUtils';

const Orders = () => {
    const navigate = useNavigate();
    const { orders, deleteOrder } = useData();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, orderId: null });


    const tabs = ['All', 'Active', 'Completed', 'Cancelled'];

    const filteredOrders = orders.filter(order => {
        const matchesTab =
            activeTab === 'All' ? true :
                activeTab === 'Active' ? ['Processing', 'Shipped'].includes(order.status) :
                    activeTab === 'Completed' ? order.status === 'Delivered' :
                        activeTab === 'Cancelled' ? order.status === 'Cancelled' : true;

        const matchesSearch =
            String(order._id || order.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items?.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesTab && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
            case 'Shipped': return 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
            case 'Processing': return 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
            case 'Cancelled': return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
            default: return 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={16} className="mr-1.5" />;
            case 'Shipped': return <Truck size={16} className="mr-1.5" />;
            case 'Processing': return <Clock size={16} className="mr-1.5" />;
            case 'Cancelled': return <RotateCcw size={16} className="mr-1.5" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pb-24 transition-colors duration-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Order History')}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('Manage and track your recent orders')}</p>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('Search orders...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto pb-4 mb-4 scrollbar-hide gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/20'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700'
                                }`}
                        >
                            {t(tab)}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <div
                                key={order._id || order.id}
                                onClick={() => navigate(`/orders/${order._id || order.id}`)}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start gap-2 mb-4">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 flex-shrink-0">
                                                <Package size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white truncate">#{String(order._id || order.id).slice(-6).toUpperCase()}</p>
                                                <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {formatOrderDateTime(order.createdAt || order.date)}
                                                    {order.scheduledDeliveryTime && (
                                                        <span className="text-blue-600 dark:text-blue-400 ml-1">
                                                            • {formatDeliveryTime(order.scheduledDeliveryTime)}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="ml-1">{t(order.status)}</span>
                                            </div>
                                            {!['Shipped', 'Delivered'].includes(order.status) && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteConfirmation({ isOpen: true, orderId: order._id || order.id });
                                                    }}
                                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title={t("Delete Order")}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                        {order.items.slice(0, 2).map((item, idx) => (
                                            <div key={idx} className="py-3 flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                                                    {item.storeId && (
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <Store size={10} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                {item.storeId.name || 'Unknown Store'}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('Quantity')}: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && (
                                            <div className="py-2 text-sm text-gray-500 dark:text-gray-400">
                                                +{order.items.length - 2} {t('more items')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('Total Amount')}</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">₹{order.total.toFixed(0)}</p>
                                        </div>
                                        <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                            {t('View Details')}
                                            <ChevronRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{t('No orders found')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">{t('Try adjusting your search or filter to find what you\'re looking for.')}</p>
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                            >
                                {t('Start Shopping')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all scale-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('Delete Order')}</h3>
                            </div>
                            <button
                                onClick={() => setDeleteConfirmation({ isOpen: false, orderId: null })}
                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            {t('Are you sure you want to delete this order? This action cannot be undone.')}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirmation({ isOpen: false, orderId: null })}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors"
                            >
                                {t('Cancel')}
                            </button>
                            <button
                                onClick={() => {
                                    if (deleteConfirmation.orderId) {
                                        deleteOrder(deleteConfirmation.orderId);
                                        setDeleteConfirmation({ isOpen: false, orderId: null });
                                    }
                                }}
                                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium shadow-lg shadow-red-200 dark:shadow-red-900/20 transition-colors"
                            >
                                {t('Delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
