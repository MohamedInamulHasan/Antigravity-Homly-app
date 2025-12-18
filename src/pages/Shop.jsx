import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Search, Star, Clock, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const Shop = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { stores, categories: dbCategories } = useData();
    const { t } = useLanguage();

    const categoryFilter = searchParams.get('category') || 'All';

    // Create categories array with "All" option first, then add categories from database
    const categories = [
        { name: 'All' },
        ...(dbCategories || []).map(cat => ({ name: cat.name }))
    ];

    if (!stores) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const filteredStores = stores.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (store.address && store.address.toLowerCase().includes(searchQuery.toLowerCase()));

        // Flexible matching for category/type
        const matchesCategory = categoryFilter === 'All' ||
            (store.type && store.type.toLowerCase() === categoryFilter.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    const handleCategoryClick = (categoryName) => {
        setSearchParams({ category: categoryName });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('Find a Store')}</h1>
                    <div className="relative max-w-xl mb-6">
                        <input
                            type="text"
                            placeholder={t('Search by store name or location...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
                    </div>

                    {/* Category Pills */}
                    <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map((category) => {
                            const isActive = category.name === categoryFilter;
                            return (
                                <button
                                    key={category.name}
                                    onClick={() => handleCategoryClick(category.name)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all duration-300 ${isActive
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:text-blue-500'
                                        }`}
                                >
                                    <span className="font-medium whitespace-nowrap text-sm">
                                        {t(category.name)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {filteredStores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStores.map((store) => (
                            <div key={store._id || store.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={store.image}
                                        alt={store.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t(store, 'name')}</h2>
                                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                                                <MapPin size={16} className="mr-1 flex-shrink-0" />
                                                <span className="line-clamp-1">{store.address || 'No address'}</span>
                                            </div>
                                            {store.type && (
                                                <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">
                                                    {store.type}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                                            <Clock size={16} className="mr-2 text-blue-500" />
                                            <span>{store.timing || '9:00 AM - 9:00 PM'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                                            <Phone size={16} className="mr-2 text-blue-500" />
                                            <span>{store.mobile}</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/store/${store._id || store.id}`}
                                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        {t('Visit Store')}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400 dark:text-gray-500" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('No stores found')}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{t('Try adjusting your search terms or category filter.')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
