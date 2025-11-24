import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Define shipping and tax for the order summary
    const shipping = 0; // Example: Free shipping
    const tax = 0;      // Example: No tax

    // Calculate total
    const total = cartTotal + shipping + tax;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors duration-200">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6">
                    <ShoppingBag className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('Your cart is empty')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
                    Looks like you haven't added anything to your cart yet.
                    Explore our products and find something you love.
                </p>
                <Link
                    to="/store"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {t('Start Shopping')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-blue-600 dark:text-blue-400" />
                    {t('Cart')}
                    <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-2">({cartItems.length} items)</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 flex gap-6 transition-all duration-200">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                <Link to={`/product/${item.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                    {item.title}
                                                </Link>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
                                        </div>
                                        <p className="ml-4 text-lg font-medium text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(0)}</p>
                                    </div>

                                    <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-medium text-gray-900 dark:text-white w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24 transition-all duration-200">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">{t('Order Summary')}</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('Subtotal')}</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">₹{cartTotal.toFixed(0)}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('Shipping')}</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t('Free')}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('Tax')}</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">₹0</p>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
                                    <p className="text-base font-medium text-gray-900 dark:text-white">{t('Total')}</p>
                                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">₹{total.toFixed(0)}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="mt-6 w-full flex items-center justify-center rounded-xl border border-transparent bg-blue-600 px-4 py-2 text-sm md:px-6 md:py-3 md:text-base font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all transform hover:scale-[1.02]"
                            >
                                {t('Proceed to Checkout')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </button>

                            <div className="mt-6 text-center">
                                <Link to="/store" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                                    {t('Continue Shopping')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
