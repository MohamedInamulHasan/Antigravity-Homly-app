import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const OrderConfirmation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { addOrder } = useData();
    const { t } = useLanguage();
    const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

    useEffect(() => {
        if (!state) {
            navigate('/cart');
        }
    }, [state, navigate]);

    if (!state) return null;

    const { formData, cartItems, cartTotal } = state;

    const handleConfirmOrder = () => {
        const newOrder = {
            id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            total: cartTotal,
            status: 'Processing',
            user: formData.name,
            shippingAddress: {
                name: formData.name,
                street: formData.address,
                city: formData.city,
                state: formData.state || '',
                zip: formData.pincode,
                country: 'India', // Default
                mobile: formData.mobile
            },
            paymentMethod: {
                type: 'Cash on Delivery',
                last4: ''
            },
            items: cartItems.map(item => ({
                name: item.title,
                quantity: item.quantity,
                image: item.image,
                price: item.price
            })),
            subtotal: cartTotal,
            shipping: 0.00,
            tax: 0.00,
            discount: 0.00
        };

        addOrder(newOrder);
        setIsOrderConfirmed(true);
        clearCart();
    };

    if (isOrderConfirmed) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <div className="max-w-md w-full text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{t('Order Placed!')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        {t('Thank you for your purchase. Your order has been confirmed and will be shipped soon.')}
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        {t('Continue Shopping')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 pb-24 transition-colors duration-200">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        {t('Back to Edit')}
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('Review Your Order')}</h1>

                        {/* Shipping Details */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('Shipping Address')}</h2>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-gray-600 dark:text-gray-300">
                                <p className="font-medium text-gray-900 dark:text-white">{formData.name}</p>
                                <p>{formData.address}</p>
                                <p>{formData.city} - {formData.pincode}</p>
                                <p className="mt-2 text-gray-500 dark:text-gray-400">{t('Mobile')}: {formData.mobile}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('Order Items')}</h2>
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700 border-t border-b border-gray-100 dark:border-gray-700">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="py-4 flex items-center space-x-4">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-16 w-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-700"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{t(item, 'title')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('Qty')}: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">₹{((item.price * item.quantity) || 0).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Totals */}
                        <div className="space-y-3 text-gray-600 dark:text-gray-400 mb-8">
                            <div className="flex justify-between">
                                <span>{t('Subtotal')}</span>
                                <span>₹{(cartTotal || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('Delivery Charge')}</span>
                                <span className="text-green-600 dark:text-green-400">{t('Free')}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-gray-700">
                                <span>{t('Total')}</span>
                                <span className="text-blue-600 dark:text-blue-400">₹{(cartTotal || 0).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Desktop Confirm Button */}
                        <div className="hidden md:block mt-8">
                            <button
                                onClick={handleConfirmOrder}
                                className="w-full bg-blue-600 text-white py-3 px-6 text-lg rounded-xl font-bold shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                            >
                                {t('Confirm Order')}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Sticky Action Footer - Mobile Only */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={handleConfirmOrder}
                        className="w-full bg-blue-600 text-white py-2.5 px-4 text-sm md:py-4 md:px-6 md:text-lg rounded-xl font-bold shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                    >
                        {t('Confirm Order')}
                    </button>
                </div>
            </div>
        </div>

    );
};

export default OrderConfirmation;
