import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { t } = useLanguage();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors duration-200">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6">
                    <ShoppingBag className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('Your cart is empty')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
                    {t('Looks like you haven\'t added anything to your cart yet.')}
                    {t('Explore our products and find something you love.')}
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
                    <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-2">({cartItems.length} {t('items')})</span>
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
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                <Link to={`/product/${item.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                    {t(item, 'title') || item.title || item.name || t('Product')}
                                                </Link>
                                            </h3>
                                            {item.storeId && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Store size={12} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {item.storeId.name || 'Unknown Store'}
                                                    </p>
                                                </div>
                                            )}
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{t(item, 'description')}</p>
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
                                            title={t('Remove item')}
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
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{cartTotal.toFixed(0)}</p>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {t('Proceed to Checkout')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
