import { Plus, Minus, Store, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { API_BASE_URL } from '../utils/api';

const SimpleProductCard = ({ product }) => {
    const { t } = useLanguage();
    const { stores } = useData();
    const { cartItems } = useCart();
    const productId = product._id || product.id;

    // Look up store name from stores context
    const store = stores?.find(s => (s._id || s.id) === product.storeId);
    const storeName = store?.name || 'Unknown Store';

    // Get cart quantity for this product
    const cartItem = cartItems.find(item => item.id === productId);
    const cartQuantity = cartItem ? cartItem.quantity : 0;

    // Check if store is open
    const isStoreOpen = store ? (
        ((s) => {
            if (!s || !s.openingTime || !s.closingTime) return true;
            const now = new Date();

            // Parse times (e.g., "9:00 AM")
            const parseTime = (timeStr) => {
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':');
                hours = parseInt(hours);
                minutes = parseInt(minutes);
                if (hours === 12 && modifier === 'PM') hours = 12;
                else if (hours === 12 && modifier === 'AM') hours = 0;
                else if (modifier === 'PM') hours += 12;
                return hours * 60 + minutes;
            };

            try {
                const openMinutes = parseTime(s.openingTime);
                let closeMinutes = parseTime(s.closingTime);

                // Handle closing time after midnight (e.g., closes at 2 AM)
                // If close time is smaller than open time, assume it means next day
                if (closeMinutes < openMinutes) {
                    closeMinutes += 24 * 60;
                }

                const currentMinutes = now.getHours() * 60 + now.getMinutes();

                return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
            } catch (e) {
                console.error("Error parsing store time:", e);
                return true; // value open if error
            }
        })(store)
    ) : true;

    const handleClick = (e) => {
        if (!isStoreOpen) {
            e.preventDefault();
            alert(t('This store is currently closed.'));
        }
    };

    return (
        <Link
            to={isStoreOpen ? `/product/${productId}` : '#'}
            onClick={handleClick}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700 ${isStoreOpen ? 'hover:shadow-lg' : 'opacity-75 grayscale-[0.5]'
                }`}
        >
            <div className="relative pb-[100%] overflow-hidden">
                <img
                    src={product.image || `${API_BASE_URL}/products/${productId}/image`}
                    alt={t(product, 'title')}
                    loading="lazy"
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ${isStoreOpen ? 'hover:scale-105' : ''}`}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                />
                {!isStoreOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-12 border-2 border-white">
                            {t('STORE CLOSED')}
                        </span>
                    </div>
                )}
                {/* Cart Quantity Badge */}
                {cartQuantity > 0 && isStoreOpen && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 z-20">
                        <ShoppingCart size={12} />
                        {cartQuantity}
                    </div>
                )}
            </div>
            <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                    <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">
                        {t(product, 'title')}
                    </h3>
                    {product.storeId && (
                        <div className="flex items-center gap-1 mb-2">
                            <Store size={12} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {storeName}
                            </p>
                        </div>
                    )}
                </div>
                <span className={`text-lg font-bold ${isStoreOpen ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                    ₹{Number(product.price || 0).toFixed(2)}
                </span>
            </div>
        </Link>
    );
};

export default SimpleProductCard;
