import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, cartTotal } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        pincode: '',
        mobile: '',
        paymentMethod: 'Cash on Delivery'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would process payment here

        navigate('/order-confirmation', {
            state: {
                formData: formData,
                cartItems,
                cartTotal
            }
        });
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('Your cart is empty')}</h2>
                <Link to="/shop" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {t('Return to Store')}
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 pb-24 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/cart')}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        {t('Back to Cart')}
                    </button>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Checkout Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('Shipping Address')}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Full Name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('Address')}
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="123 Main St"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('City')}
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                required
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="City Name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('Pincode')}
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="pincode"
                                                name="pincode"
                                                required
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                className="block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="123456"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('Mobile Number')}
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="tel"
                                                id="mobile"
                                                name="mobile"
                                                required
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                className="block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('Payment Method')}</h2>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{t('Cash on Delivery')}</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sm:p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('Order Summary')}</h2>
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700 mb-6">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="py-4 flex items-start space-x-4">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-16 w-16 rounded-lg object-cover bg-gray-100 dark:bg-gray-700"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{item.title}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(0)}</p>
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-6">
                                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                                    <span>{t('Subtotal')}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹{cartTotal.toFixed(0)}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                                    <span>{t('Shipping')}</span>
                                    <span className="text-green-600 dark:text-green-400 font-medium">{t('Free')}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                                    <span>{t('Tax')}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹0</span>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">{t('Total')}</span>
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{cartTotal.toFixed(0)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Including VAT</p>
                                    {/* Desktop Place Order Button */}
                                    <div className="hidden md:block mt-6">
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full bg-blue-600 text-white py-4 px-6 text-lg rounded-xl font-bold shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                                        >
                                            {t('Place Order')} • ₹{cartTotal.toFixed(0)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Action Footer - Mobile Only */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden">
                        <div className="max-w-7xl mx-auto">
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-blue-600 text-white py-3 px-4 text-base md:py-4 md:px-6 md:text-lg rounded-xl font-bold shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                            >
                                {t('Place Order')} • ₹{cartTotal.toFixed(0)}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
