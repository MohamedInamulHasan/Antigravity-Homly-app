import { Plus, Minus, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const SimpleProductCard = ({ product }) => {
    const { t } = useLanguage();
    const productId = product._id || product.id;

    return (
        <Link
            to={`/product/${productId}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700"
        >
            <div className="relative pb-[100%] overflow-hidden">
                <img
                    src={product.image}
                    alt={t(product, 'title')}
                    className="absolute top-0 left-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
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
                                {product.storeId.name || 'Unknown Store'}
                            </p>
                        </div>
                    )}
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ₹{Number(product.price || 0).toFixed(2)}
                </span>
            </div>
        </Link>
    );
};

export default SimpleProductCard;
