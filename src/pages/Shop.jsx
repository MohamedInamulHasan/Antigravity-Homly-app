import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Star, Clock, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const Shop = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { stores } = useData();
    const { t } = useLanguage();

    if (!stores) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Find a Store</h1>
                    <div className="relative max-w-xl">
                        <input
                            type="text"
                            placeholder="Search by store name or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
                    </div>
                </div>

                {filteredStores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStores.map((store) => (
                            <div key={store.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group">
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
                                                <span className="line-clamp-1">{t(store, 'location')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                                            <Star size={14} className="text-green-600 dark:text-green-400 mr-1 fill-current" />
                                            <span className="text-sm font-bold text-green-700 dark:text-green-400">{store.rating}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                                            <Clock size={16} className="mr-2 text-blue-500" />
                                            <span>{store.hours}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                                            <Phone size={16} className="mr-2 text-blue-500" />
                                            <span>{store.mobile}</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/store/${store.id}`}
                                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        Visit Store
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
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stores found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
