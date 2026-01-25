import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/queries/useProducts';
import { useLanguage } from '../context/LanguageContext';
import SimpleProductCard from '../components/SimpleProductCard';
import ProductCard from '../components/ProductCard';
import PullToRefreshLayout from '../components/PullToRefreshLayout';
import { ChevronLeft } from 'lucide-react';

const ProductGroupProducts = () => {
    const { productName } = useParams();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isFastPurchase, setIsFastPurchase] = useState(searchParams.get('fast') === 'true');

    // Fetch all products - we catch them from cache/query
    const { data: rawProducts = [], isLoading } = useProducts();
    const products = Array.isArray(rawProducts) ? rawProducts : (rawProducts?.data || []);

    // Filter products by name (case-insensitive)
    // DecodeURIComponent is handled by router usually, but let's be safe if manual decoding needed
    const decodedName = decodeURIComponent(productName);

    const groupProducts = products.filter(product =>
        product.title?.toLowerCase().trim() === decodedName.toLowerCase().trim()
    );

    return (
        <PullToRefreshLayout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-200">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <ChevronLeft className="text-gray-600 dark:text-white" size={24} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                                    {t(decodedName)}
                                </h1>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsFastPurchase(!isFastPurchase)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all active:scale-95 ${isFastPurchase
                                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200 dark:ring-blue-900'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            <span>⚡</span>
                            <span className="hidden sm:inline">{t('Fast Purchase')}</span>
                            <span className="sm:hidden">{t('Fast')}</span>
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : groupProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {groupProducts.map(product => (
                                isFastPurchase ? (
                                    <ProductCard key={product._id || product.id} product={product} />
                                ) : (
                                    <SimpleProductCard key={product._id || product.id} product={product} />
                                )
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <span className="text-4xl">🛍️</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('No products found')}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                {t('We couldn\'t find any products with this name.')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PullToRefreshLayout>
    );
};

export default ProductGroupProducts;
