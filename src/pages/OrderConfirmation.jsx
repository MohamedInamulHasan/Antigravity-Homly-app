import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, ArrowLeft, MapPin } from 'lucide-react';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { addOrder } = useData();
    const { t } = useLanguage();

    const { formData, cartItems, cartTotal, deliveryCharge } = location.state || {};
    const finalTotal = (cartTotal || 0) + (deliveryCharge || 0);

    if (!location.state) {
        return <Navigate to="/" replace />;
    }

    const handleConfirmOrder = () => {
        // Create order object
        const newOrder = {
            id: Math.floor(100000 + Math.random() * 900000), // Generate 6-digit ID
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            status: 'Processing',
            items: cartItems,
            total: finalTotal,
            subtotal: cartTotal,
            shipping: deliveryCharge,
            tax: 0,
            discount: 0,
            shippingAddress: {
                name: formData.name,
                street: formData.address,
                city: formData.city,
                state: '', // Assuming state is not collected or can be inferred
                zip: formData.pincode,
                country: 'India' // Defaulting to India
            },
            paymentMethod: {
                type: 'Cash on Delivery',
                last4: ''
            }
        };

        addOrder(newOrder);
        clearCart();
        navigate(`/orders/${newOrder.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 pb-24 transition-colors duration-200">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-green-600 p-8 text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <CheckCircle className="text-green-600" size={40} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{t('Order Confirmed!')}</h1>
                        <p className="text-green-100 text-lg">{t('Thank you for your purchase.')}</p>
                    </div>

                    <div className="p-8">
                        <div className="border-b border-gray-100 dark:border-gray-700 pb-8 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('Order Summary')}</h2>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{t(item, 'title')}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('Qty')}: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">₹{((item.price * item.quantity) || 0).toFixed(0)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>{t('Subtotal')}</span>
                                <span>₹{(cartTotal || 0).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>{t('Delivery Charge')}</span>
                                <span>₹{(deliveryCharge || 0).toFixed(0)}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">{t('Total')}</span>
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{finalTotal.toFixed(0)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <MapPin className="text-gray-400" size={20} />
                        {t('Shipping Details')}
                    </h2>
                    <div className="text-gray-600 dark:text-gray-300 space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white">{formData.name}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.pincode}</p>
                        <p>{t('Mobile')}: {formData.mobile}</p>
                    </div>
                </div>
            </div>

            {/* Sticky Action Footer - Mobile Only */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={handleConfirmOrder}
                        className="w-[90%] mx-auto block bg-blue-600 text-white py-2.5 px-4 text-sm md:py-4 md:px-6 md:text-lg rounded-xl font-bold shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                    >
                        {t('Confirm Order')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
