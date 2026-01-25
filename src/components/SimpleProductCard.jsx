import { Plus, Minus, Store, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { API_BASE_URL } from '../utils/api';
import { isStoreOpen } from '../utils/storeHelpers';

const SimpleProductCard = ({ product, isFastPurchase }) => {
    const { t } = useLanguage();
    const { stores } = useData();
    const { cartItems } = useCart();
    const productId = product._id || product.id;

    // Look up store name from stores context
    const storeIdStr = product.storeId?._id || product.storeId;
    const store = stores?.find(s => (s._id || s.id) === storeIdStr);
    const storeName = store?.name || product.storeId?.name || 'Unknown Store';

    // Get cart quantity for this product
    const cartItem = cartItems.find(item => item.id === productId);
    const cartQuantity = cartItem ? cartItem.quantity : 0;

    // Check if store is open
    // Use the helper logic for consistency
    const isStoreOpenCheck = store ? isStoreOpen(store) : true;

    const handleClick = (e) => {
        if (!isStoreOpenCheck) {
            e.preventDefault();
            alert(t('This store is currently closed.'));
        }
    };

    // Handle Grouped Products
    if (product.isGroup) {
        return (
            <Link
                to={`/product-group/${encodeURIComponent(product.title)}${isFastPurchase ? '?fast=true' : ''}`}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700 ${product.anyStoreOpen ? 'hover:shadow-lg' : 'opacity-75 grayscale-[0.5]'}`}
            >
                <div className="relative pb-[100%] overflow-hidden">
                    <img
                        src={product.image || `${API_BASE_URL}/products/${product._id.replace('group-', '')}/image`}
                        alt={t(product, 'title')}
                        loading="lazy"
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ${isStoreOpenCheck || product.anyStoreOpen ? 'hover:scale-105' : ''}`}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                    />
                    {/* Show Closed Overlay for Group ONLY if ALL stores are closed */}
                    {product.isGroup && !product.anyStoreOpen && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-12 border-2 border-white">
                                {t('STORE CLOSED')}
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                        {(() => {
                            const fullTitle = t(product, 'title');
                            const bracketIndex = fullTitle.indexOf('(');
                            let mainTitle = fullTitle;
                            let bracketContent = '';

                            if (bracketIndex !== -1) {
                                mainTitle = fullTitle.substring(0, bracketIndex).trim();
                                bracketContent = fullTitle.substring(bracketIndex).trim();
                            }

                            // Dynamic sizing logic
                            const isMainTitleLong = mainTitle.length > 20;
                            const isBracketLong = bracketContent.length > 20;

                            return (
                                <div className="mb-1">
                                    <h3 className={`${isMainTitleLong ? 'text-xs md:text-sm' : 'text-sm md:text-base'} font-semibold text-gray-800 dark:text-white leading-tight truncate`}>
                                        {mainTitle}
                                    </h3>
                                    {bracketContent && (
                                        <span className={`block ${isBracketLong ? 'text-[10px]' : 'text-xs'} text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate`}>
                                            {bracketContent}
                                        </span>
                                    )}
                                </div>
                            );
                        })()}
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold truncate mb-2">
                            +{product.storeCount} {t('options')}
                        </p>
                    </div>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {product.minPrice !== undefined && product.maxPrice !== undefined && product.minPrice !== product.maxPrice
                            ? `₹${product.minPrice.toFixed(0)} - ₹${product.maxPrice.toFixed(0)}`
                            : `₹${Number(product.price || 0).toFixed(0)}`
                        }
                    </span>
                </div>
            </Link>
        );
    }

    const isAvailable = product.isAvailable !== false; // Default to true

    return (
        <Link
            to={(isStoreOpenCheck && isAvailable) ? `/product/${productId}` : '#'}
            onClick={(e) => {
                if (!isAvailable) {
                    e.preventDefault();
                    // Optional: Alert or just do nothing
                    return;
                }
                handleClick(e);
            }}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700 ${isStoreOpenCheck && isAvailable ? 'hover:shadow-lg' : 'opacity-75 grayscale-[0.5] cursor-not-allowed'
                }`}
        >
            <div className="relative pb-[100%] overflow-hidden">
                <img
                    src={product.image || `${API_BASE_URL}/products/${productId}/image`}
                    alt={t(product, 'title')}
                    loading="lazy"
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ${isStoreOpenCheck && isAvailable ? 'hover:scale-105' : ''}`}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                />
                {!isStoreOpenCheck && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-12 border-2 border-white">
                            {t('STORE CLOSED')}
                        </span>
                    </div>
                )}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-12 border-2 border-white">
                            {t('OUT OF STOCK')}
                        </span>
                    </div>
                )}
                {/* Cart Quantity Badge */}
                {cartQuantity > 0 && isStoreOpenCheck && isAvailable && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 z-20">
                        <ShoppingCart size={12} />
                        {cartQuantity}
                    </div>
                )}
                {/* Unit Tag */}
                {product.unit && (
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-sm z-10">
                        {product.unit}
                    </div>
                )}
            </div>
            <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                    {(() => {
                        const fullTitle = t(product, 'title');
                        const bracketIndex = fullTitle.indexOf('(');
                        let mainTitle = fullTitle;
                        let bracketContent = '';

                        if (bracketIndex !== -1) {
                            mainTitle = fullTitle.substring(0, bracketIndex).trim();
                            bracketContent = fullTitle.substring(bracketIndex).trim();
                        }

                        // Dynamic sizing logic
                        const isMainTitleLong = mainTitle.length > 20;
                        const isBracketLong = bracketContent.length > 20;

                        return (
                            <div className="mb-1">
                                <h3 className={`${isMainTitleLong ? 'text-xs md:text-sm' : 'text-sm md:text-base'} font-semibold text-gray-800 dark:text-white leading-tight truncate`}>
                                    {mainTitle}
                                </h3>
                                {bracketContent && (
                                    <span className={`block ${isBracketLong ? 'text-[10px]' : 'text-xs'} text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate`}>
                                        {bracketContent}
                                    </span>
                                )}
                            </div>
                        );
                    })()}
                    {product.storeId && (
                        <div className="flex items-center gap-1 mb-2">
                            <Store size={12} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {storeName}
                            </p>
                        </div>
                    )}
                </div>
                <span className={`text-lg font-bold ${isStoreOpenCheck && isAvailable ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                    ₹{Number(product.price || 0).toFixed(0)}
                </span>
            </div>
        </Link>
    );
};

export default SimpleProductCard;
