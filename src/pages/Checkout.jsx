import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { getStoreName } from '../utils/storeHelpers';
import { CreditCard, Truck, MapPin, ShieldCheck, ShoppingBag, ArrowLeft, Store } from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { t } = useLanguage();
    const { stores } = useData();
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        address: '',
        city: '',
        zip: '',
        deliveryTime: '',
        paymentMethod: 'cod'
    });

    // Check if user is authenticated
    useEffect(() => {
        if (!user) {
            // Store the current path to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', '/checkout');
            alert(t('Please sign in to continue with checkout'));
            navigate('/login');
        }
    }, [user, navigate, t]);

    // If no user, don't render the form (will redirect)
    if (!user) {
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.address || !formData.city || !formData.zip) {
            alert(t('Please fill in all required fields'));
            return;
        }

        const mobileRegex = /^\d{10}$/;
        const zipRegex = /^\d{6}$/;

        if (!mobileRegex.test(formData.mobile)) {
            alert(t('Please enter a valid 10-digit mobile number'));
            return;
        }

        if (!zipRegex.test(formData.zip)) {
            alert(t('Please enter a valid 6-digit ZIP code'));
            return;
        }

        // Validate delivery time is selected
        if (!formData.deliveryTime) {
            alert(t('Please select a preferred delivery time'));
            return;
        }

        // Navigate to order confirmation with form data and cart details
        // We map the fields to match what OrderConfirmation expects
        const deliveryCharge = 20;
        navigate('/order-confirmation', {
            state: {
                formData: {
                    ...formData,
                    name: formData.fullName,
                    pincode: formData.zip
                },
                cartItems,
                cartTotal,
                deliveryCharge
            }
        });
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    const deliveryCharge = 20;
    const finalTotal = cartTotal + deliveryCharge;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 pb-24 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors group"
                >
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                    <span className="font-medium">{t('Back to Cart')}</span>
                </button>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <ShieldCheck className="text-blue-600 dark:text-blue-400" />
                    {t('Checkout')}
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
                                {t('Shipping Details')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Full Name')}</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                        placeholder={t('Enter your full name')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Mobile Number')}</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        required
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                        placeholder={t('Enter your mobile number')}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Address')}</label>
                                    <textarea
                                        name="address"
                                        required
                                        rows="3"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none"
                                        placeholder={t('Enter your full address')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('City')}</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                        placeholder={t('Enter city')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('ZIP Code')}</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        required
                                        value={formData.zip}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                        placeholder={t('Enter ZIP code')}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('Preferred Delivery Time')} <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="deliveryTime"
                                        required
                                        value={formData.deliveryTime}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                                    >
                                        <option value="">{t('Select a time slot')}</option>
                                        {(() => {
                                            const slots = [];
                                            const now = new Date();

                                            // Start from current time + 30 minutes
                                            const startTime = new Date(now.getTime() + 30 * 60000);

                                            // Round to next 30-minute slot
                                            const minutes = startTime.getMinutes();
                                            if (minutes < 30) {
                                                startTime.setMinutes(30, 0, 0);
                                            } else {
                                                startTime.setMinutes(0, 0, 0);
                                                startTime.setHours(startTime.getHours() + 1);
                                            }

                                            // Generate slots until 11:30 PM
                                            const endOfDay = new Date();
                                            endOfDay.setHours(23, 30, 0, 0);

                                            // If start time is after end of day, show next day slots
                                            if (startTime > endOfDay) {
                                                startTime.setDate(startTime.getDate() + 1);
                                                startTime.setHours(9, 0, 0, 0); // Start from 9 AM next day
                                                endOfDay.setDate(endOfDay.getDate() + 1);
                                            }

                                            // Generate all 30-minute slots
                                            const currentSlot = new Date(startTime);
                                            while (currentSlot <= endOfDay) {
                                                const hours = currentSlot.getHours();
                                                const minutes = currentSlot.getMinutes();
                                                const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                                                const displayTime = currentSlot.toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                });

                                                slots.push(
                                                    <option key={timeString} value={timeString}>
                                                        {displayTime}
                                                    </option>
                                                );

                                                // Move to next 30-minute slot
                                                currentSlot.setMinutes(currentSlot.getMinutes() + 30);
                                            }

                                            return slots;
                                        })()}
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {t('Choose your preferred delivery time (available slots from now until 11:30 PM)')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <CreditCard className="text-blue-600 dark:text-blue-400" size={24} />
                                {t('Payment Method')}
                            </h2>
                            <div className="space-y-4">
                                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formData.paymentMethod === 'cod'}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-4">
                                        <span className="block font-medium text-gray-900 dark:text-white">{t('Cash on Delivery')}</span>
                                        <span className="block text-sm text-gray-500 dark:text-gray-400">{t('Pay when you receive your order')}</span>
                                    </div>
                                    <Truck className="ml-auto text-gray-400" size={24} />
                                </label>


                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('Order Summary')}</h2>

                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{t(item, 'title') || item.title || item.name || t('Product')}</h3>
                                            {item.storeId && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Store size={10} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {getStoreName(item.storeId, stores)}
                                                    </p>
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('Qty')}: {item.quantity}</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(0)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">{t('Subtotal')}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹{cartTotal.toFixed(0)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">{t('Delivery Charge')}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹20</span>
                                </div>
                                <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-gray-900 dark:text-white">{t('Total')}</span>
                                    <span className="text-blue-600 dark:text-blue-400">₹{finalTotal.toFixed(0)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="hidden md:flex w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
                            >
                                <ShoppingBag size={22} />
                                {t('Review Order')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Sticky Action Footer - Mobile Only */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t('Total')}</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₹{finalTotal.toFixed(0)}</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
                    >
                        <ShoppingBag size={20} />
                        {t('Review Order')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
