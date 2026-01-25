import { Plus, Minus, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../utils/api';

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

    const isAvailable = product.isAvailable !== false; // Default to true if undefined

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700 relative group ${!isAvailable ? 'opacity-75' : ''}`}>
            <Link to={`/product/${productId}`} className={`flex-1 block ${!isAvailable ? 'pointer-events-none' : ''}`}>
                <div className="relative pb-[100%] overflow-hidden bg-white">
                    <img
                        src={product.image || `${API_BASE_URL}/products/${productId}/image`}
                        alt={t(product, 'title')}
                        loading="lazy"
                        className={`absolute top-0 left-0 w-full h-full object-cover transform transition-transform duration-300 ${isAvailable ? 'group-hover:scale-105' : 'grayscale'}`}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                    />
                    {/* Heart Button */}
                    <button
                        onClick={handleToggleSave}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 transition-colors shadow-sm z-10 pointer-events-auto"
                    >
                        <Bookmark
                            size={18}
                            className={`${isSaved ? 'text-blue-600 fill-current' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}
                        />
                    </button>
                    {!isAvailable && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[1px]">
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                {t('Out of Stock')}
                            </span>
                        </div>
                    )}
                    {/* Unit Tag */}
                    {product.unit && (
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-sm z-10 pointer-events-none">
                            {product.unit}
                        </div>
                    )}
                </div>
                <div className="p-4 pb-0">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                        {t(product, 'title')}
                    </h3>

                </div>
            </Link>
            <div className="p-4 pt-2 mt-auto">
                <div className="flex flex-col gap-3">
                    <span className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">₹{Number(product.price || 0).toFixed(0)}</span>
                    {cartItem ? (
                        <div className="flex items-center justify-between w-full gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => updateQuantity(productId, cartItem.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 focus:outline-none rounded-full transition-colors shadow-sm"
                                aria-label="Decrease quantity"
                                disabled={!isAvailable}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="font-bold text-gray-900 dark:text-white text-lg">{cartItem.quantity}</span>
                            <button
                                onClick={() => updateQuantity(productId, cartItem.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 focus:outline-none rounded-full transition-colors shadow-sm"
                                aria-label="Increase quantity"
                                disabled={!isAvailable}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => addToCart(product)}
                            disabled={!isAvailable}
                            className={`w-full p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center gap-2 ${isAvailable
                                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                            aria-label={isAvailable ? "Add to cart" : "Out of stock"}
                        >
                            <Plus size={20} />
                            <span className="text-sm font-medium">{isAvailable ? 'Add' : 'Out of Stock'}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
