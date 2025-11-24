import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, RotateCcw } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { orders } = useData();

    const order = orders.find(o => o.id === id);

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-200">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('Order not found')}</h2>
                <button
                    onClick={() => navigate('/orders')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    {t('Back to Orders')}
                </button>
            </div>
        );
    }

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
            case 'Delivered': return <CheckCircle size={20} className="mr-2" />;
            case 'Shipped': return <Truck size={20} className="mr-2" />;
            case 'Processing': return <Clock size={20} className="mr-2" />;
            case 'Cancelled': return <RotateCcw size={20} className="mr-2" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pb-24 transition-colors duration-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    {t('Back to Orders')}
                </button>

                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('Order Details')}</h1>
                            <p className="text-gray-500 dark:text-gray-400">{t('Order')} #{order.id} • {order.date}</p>
                        </div>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {t(order.status)}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <Package size={20} className="mr-2 text-gray-400 dark:text-gray-500" />
                            {t('Items')}
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {order.items?.map((item, index) => (
                            <div key={index} className="p-6 flex items-start gap-4">
                                <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-100 dark:border-gray-600">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">{item.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{t('Quantity')}: {item.quantity}</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">₹{Number(item.price || 0).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                            <MapPin size={20} className="mr-2 text-gray-400 dark:text-gray-500" />
                            {t('Shipping Address')}
                        </h2>
                        <address className="not-italic text-gray-600 dark:text-gray-300 space-y-1">
                            <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress?.name || 'N/A'}</p>
                            <p>{order.shippingAddress?.street || ''}</p>
                            <p>{order.shippingAddress?.city || ''}, {order.shippingAddress?.state || ''} {order.shippingAddress?.zip || ''}</p>
                            <p>{order.shippingAddress?.country || ''}</p>
                        </address>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                            <CreditCard size={20} className="mr-2 text-gray-400 dark:text-gray-500" />
                            {t('Payment Method')}
                        </h2>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <span className="font-medium text-gray-900 dark:text-white mr-2">{order.paymentMethod?.type || t('Card')}</span>
                            <span>{t('ending in')} {order.paymentMethod?.last4 || '****'}</span>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('Order Summary')}</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>{t('Subtotal')}</span>
                            <span>₹{Number(order.subtotal || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>{t('Shipping')}</span>
                            <span>{Number(order.shipping || 0) === 0 ? t('Free') : `₹${Number(order.shipping).toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>{t('Tax')}</span>
                            <span>₹{Number(order.tax || 0).toFixed(2)}</span>
                        </div>
                        {Number(order.discount || 0) !== 0 && (
                            <div className="flex justify-between text-green-600 dark:text-green-400">
                                <span>{t('Discount')}</span>
                                <span>-₹{Math.abs(Number(order.discount)).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between font-bold text-gray-900 dark:text-white text-lg">
                            <span>{t('Total')}</span>
                            <span>₹{Number(order.total || 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
