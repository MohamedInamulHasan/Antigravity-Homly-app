import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Phone, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';

const StoreProducts = () => {
    const { id } = useParams();
    const { products, stores } = useData();
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const storeId = id;

    // Find store and its products
    const store = stores.find(s => (s._id || s.id) === storeId);

    // Filter products for this store
    // Ensure we handle both string and number ID comparisons
    const storeProducts = useMemo(() => {
        return products.filter(p => {
            const pStoreId = p.storeId;
            const targetId = storeId;
            // Loose comparison to catch '1' vs 1
            return pStoreId == targetId;
        });
    }, [products, storeId]);

    // Extract unique categories from the store's products
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(storeProducts.map(p => p.category))];
        return uniqueCategories.map(cat => ({
            name: cat,
            // Find first product image as category thumbnail
            image: storeProducts.find(p => p.category === cat)?.image,
            count: storeProducts.filter(p => p.category === cat).length
        })).filter(c => c.name); // Filter out undefined categories
    }, [storeProducts]);

    // Filter products to display based on selected category
    const displayedProducts = selectedCategory
        ? storeProducts.filter(p => p.category === selectedCategory)
        : [];

    if (!store) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('Store not found')}</h2>
                <Link to="/store" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-2">
                    <ArrowLeft size={20} />
                    {t('Back to Stores')}
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Header / Breadcrumbs */}
            <div className="mb-8">
                <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <Link to="/store" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {t('Stores')}
                    </Link>
                    <ChevronRight size={16} className="mx-2" />
                    <span className={!selectedCategory ? "font-semibold text-gray-900 dark:text-white" : ""}>
                        {store.name}
                    </span>
                    {selectedCategory && (
                        <>
                            <ChevronRight size={16} className="mx-2" />
                            <span className="font-semibold text-gray-900 dark:text-white cursor-pointer" onClick={() => setSelectedCategory(null)}>
                                {t(selectedCategory)}
                            </span>
                        </>
                    )}
                </nav>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{store.name}</h1>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{store.address || t('No address available')}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{store.timing || '9:00 AM - 9:00 PM'}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                            <Phone className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{store.mobile || t('No phone number')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {selectedCategory ? (
                /* Product Grid View */
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t(selectedCategory)}</h2>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {displayedProducts.length} {t('products')}
                        </span>
                    </div>

                    {displayedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {displayedProducts.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('No products found in this category')}</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Category Tile View */
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('Shop by Category')}</h2>

                    {categories.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {categories.map((cat) => (
                                <div
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                                        {cat.image ? (
                                            <img
                                                src={cat.image}
                                                alt={cat.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span className="text-4xl">📦</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {t(cat.name)}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {cat.count} {t('items')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('No products available at this store currently.')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StoreProducts;
