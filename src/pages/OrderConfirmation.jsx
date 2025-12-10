import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, ArrowLeft, MapPin, ClipboardList, ShoppingBag } from 'lucide-react';

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

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdOrderId, setCreatedOrderId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirmOrder = () => {
        setShowConfirmModal(true);
    };

    const confirmOrderAction = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Use provided delivery charge or default to 20
        const finalDeliveryCharge = deliveryCharge !== undefined ? deliveryCharge : 20;

        // Create order object matching backend schema
        const newOrder = {
            items: cartItems.map(item => ({
                product: item._id || item.id,
                name: item.title || item.name || 'Product', // Fallback for safety
                quantity: item.quantity,
                price: item.price,
                image: item.image
            })),
            total: finalTotal || ((cartTotal || 0) + finalDeliveryCharge),
            subtotal: cartTotal,
            shipping: finalDeliveryCharge,
            tax: 0,
            discount: 0,
            shippingAddress: {
                name: formData.name,
                street: formData.address,
                city: formData.city,
                state: '',
                zip: formData.pincode,
                country: 'India',
                mobile: formData.mobile
            },
            paymentMethod: {
                type: 'Cash on Delivery',
                last4: ''
            }
        };

        try {
            const createdOrder = await addOrder(newOrder);
            clearCart();
            setCreatedOrderId(createdOrder?._id || 'NEW');
            setShowConfirmModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Failed to create order:", error);
            const errorMessage = error.response?.data?.message || error.message || t('Failed to place order. Please try again.');
            alert(`${t('Error')}: ${errorMessage}`);
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccess = () => {
        if (createdOrderId) {
            navigate(`/orders/${createdOrderId}`);
        } else {
            navigate('/orders');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 pb-24 transition-colors duration-200">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors group"
                >
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                    <span className="font-medium">{t('Back to Edit')}</span>
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-blue-600 p-8 text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-blue-600">
                            <ClipboardList size={40} />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{t('Review Order')}</h1>
                        <p className="text-blue-100 text-lg">{t('Please review your details before confirming.')}</p>
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
                                                <p className="font-medium text-gray-900 dark:text-white">{t(item, 'title') || item.title || item.name || t('Product')}</p>
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
                                <span>₹{(deliveryCharge || 20).toFixed(0)}</span>
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
                        <MapPin className="text-blue-600 dark:text-blue-400" size={20} />
                        {t('Shipping Details')}
                    </h2>
                    <div className="text-gray-600 dark:text-gray-300 space-y-1">
                        <p className="font-medium text-gray-900 dark:text-white">{formData.name}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.pincode}</p>
                        <p>{t('Mobile')}: {formData.mobile}</p>
                    </div>
                </div>

                {/* Desktop Confirm Button */}
                <div className="hidden md:block">
                    <button
                        onClick={handleConfirmOrder}
                        className="w-full bg-blue-600 text-white py-4 px-6 text-lg rounded-xl font-bold shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                    >
                        {t('Place Order')}
                    </button>
                </div>
            </div>

            {/* Sticky Action Footer - Mobile Only */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={handleConfirmOrder}
                        className="w-[90%] mx-auto block bg-blue-600 text-white py-2.5 px-4 text-sm md:py-4 md:px-6 md:text-lg rounded-xl font-bold shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                    >
                        {t('Place Order')}
                    </button>
                </div>
            </div>

            {/* Confirmation Modal (Are you sure?) */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-sm w-full p-8 transform transition-all scale-100 animate-bounce-subtle border border-gray-100 dark:border-gray-700">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 dark:bg-blue-900/40 mb-6 shadow-inner relative group">
                                <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping group-hover:animate-none"></div>
                                <ShoppingBag className="h-10 w-10 text-blue-600 dark:text-blue-400 relative z-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                {t('Ready to Wrap Up?')}
                            </h3>
                            <p className="text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                                {t('You are just one step away from confirming your order. Do you want to proceed?')}
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3.5 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
                                >
                                    {t('Cancel')}
                                </button>
                                <button
                                    onClick={confirmOrderAction}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {t('Processing')}
                                        </>
                                    ) : (
                                        t('Confirm Order')
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal (With Design) */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-green-500/20 backdrop-blur-md">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-sm w-full p-8 transform transition-all scale-100 animate-bounce-subtle">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('Order Placed!')}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {t('Your order has been placed successfully. Thank you for shopping with us!')}
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('Order ID')}</p>
                                <p className="font-mono font-bold text-gray-900 dark:text-white text-lg">
                                    #{String(createdOrderId || '000').slice(-6).toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={handleCloseSuccess}
                                className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors"
                            >
                                {t('View Order Details')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderConfirmation;
