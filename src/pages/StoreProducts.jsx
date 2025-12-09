import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';

const StoreProducts = () => {
    const { id } = useParams();
    const { products, stores } = useData();
    const { t } = useLanguage();
    const storeId = id;

    // Find store and its products from global context
    const store = stores.find(s => (s._id || s.id) === storeId);
    const storeProducts = products.filter(p => (p.storeId === storeId) || (p.storeId === parseInt(storeId)));

    if (!store) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-200">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Store not found</h2>
                <Link to="/store" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-2">
                    <ArrowLeft size={20} />
                    Back to Stores
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="mb-8">
                <Link to="/store" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Stores
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t(store, 'name')}</h1>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{t(store, 'location')}</span>
                </div>
            </div>

            {storeProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {storeProducts.map((product) => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No products available at this store currently.</p>
                </div>
            )}
        </div>
    );
};

export default StoreProducts;
