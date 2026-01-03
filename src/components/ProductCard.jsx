import { Plus, Minus, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const ProductCard = ({ product }) => {
    const { addToCart, cartItems, updateQuantity } = useCart();
    const { savedProducts, toggleSaveProduct } = useData();
    const { t } = useLanguage();

    const productId = product._id || product.id;
    const cartItem = cartItems.find(item => item.id === productId);
    const isSaved = savedProducts.some(p => (p._id || p.id || p) === productId);

    const handleToggleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaveProduct(productId);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700 relative group">
            <Link to={`/product/${productId}`} className="flex-1 block">
                <div className="relative pb-[100%] overflow-hidden">
                    <img
                        src={product.image}
                        alt={t(product, 'title')}
                        loading="lazy"
                        className="absolute top-0 left-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Heart Button */}
                    <button
                        onClick={handleToggleSave}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 transition-colors shadow-sm z-10"
                    >
                        <Heart
                            size={18}
                            className={`${isSaved ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'}`}
                        />
                    </button>
                </div>
                <div className="p-4 pb-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t(product, 'title')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{t(product, 'description')}</p>
                </div>
            </Link>
            <div className="p-4 pt-2 mt-auto">
                <div className="flex flex-col gap-3">
                    <span className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">₹{Number(product.price || 0).toFixed(2)}</span>
                    {cartItem ? (
                        <div className="flex items-center justify-between w-full gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => updateQuantity(productId, cartItem.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 focus:outline-none rounded-full transition-colors shadow-sm"
                                aria-label="Decrease quantity"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="font-bold text-gray-900 dark:text-white text-lg">{cartItem.quantity}</span>
                            <button
                                onClick={() => updateQuantity(productId, cartItem.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 focus:outline-none rounded-full transition-colors shadow-sm"
                                aria-label="Increase quantity"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => addToCart(product)}
                            className="w-full bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center gap-2"
                            aria-label="Add to cart"
                        >
                            <Plus size={20} />
                            <span className="text-sm font-medium">Add</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
