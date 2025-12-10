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

    const handleConfirmOrder = () => {
        setShowConfirmModal(true);
    };

    const confirmOrderAction = async () => {
        // Create order object matching backend schema
        const newOrder = {
            items: cartItems.map(item => ({
                product: item._id || item.id,
                name: item.title,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            })),
            total: finalTotal,
            subtotal: cartTotal,
            shipping: deliveryCharge,
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
            alert("Failed to place order. Please try again.");
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-6 transform transition-all scale-100">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {t('Place Order?')}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                {t('Are you sure you want to confirm this order?')}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    {t('Cancel')}
                                </button>
                                <button
                                    onClick={confirmOrderAction}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {t('Confirm')}
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
