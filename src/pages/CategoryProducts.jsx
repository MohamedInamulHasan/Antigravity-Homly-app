import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/queries/useProducts';
import { useLanguage } from '../context/LanguageContext';
import SimpleProductCard from '../components/SimpleProductCard';
import PullToRefreshLayout from '../components/PullToRefreshLayout';
import { ChevronLeft } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

const CategoryProducts = () => {
    const { categoryName } = useParams();
    const { data: rawProducts = [], isLoading } = useProducts();
    const { t } = useLanguage();

    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const products = Array.isArray(rawProducts) ? rawProducts : (rawProducts?.data || []);

    // Filter products by category AND search query
    const categoryProducts = products.filter(product => {
        const matchesCategory = product.category && product.category.toLowerCase() === categoryName?.toLowerCase();
        const matchesSearch = !searchQuery.trim() ||
            product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Get category image from first product
    const categoryImage = categoryProducts.length > 0 ? categoryProducts[0].image : null;

    return (
        <PullToRefreshLayout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-200">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                        <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <ChevronLeft className="text-gray-600 dark:text-white" size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                            {t(categoryName)}
                        </h1>
                    </div>
                </div>

                {/* Mobile Search Bar - Exactly like Home.jsx */}
                <div className="bg-white dark:bg-gray-800 py-4 shadow-sm border-t border-gray-100 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="relative">
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    name="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('Search products...')}
                                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                                />
                                <svg
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </form>

                            {/* Search Results Dropdown */}
                            {searchQuery.trim() && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-30">
                                    {(() => {
                                        // Use categoryProducts (which are already filtered by category) for the dropdown source
                                        // Note: categoryProducts in the main body is ALREADY filtered by searchQuery due to previous edit.
                                        // But for the dropdown, we generally want "suggestions" which might be distinct from the grid filter?
                                        // Actually, if the main grid overwrites instantly, the dropdown is redundant visually? 
                                        // BUT user asked for "show the products like in the home page". Home page has dropdown.
                                        // Let's use the 'products' (raw category list) and filter it here specifically for the dropdown to ensure it shows top 5.

                                        // Re-calculate category-only products (without search query filter) to be safe or use the existing list?
                                        // The existing 'categoryProducts' variable I created includes the SEARCH filter. 
                                        // If I use that, it's fine, but if I want the dropdown to be the primary interaction...
                                        // Let's just use the filtered list.

                                        const filteredDropdown = categoryProducts.slice(0, 5);

                                        if (filteredDropdown.length === 0) {
                                            return (
                                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                    {t('No products found')}
                                                </div>
                                            );
                                        }

                                        return filteredDropdown.map((product) => (
                                            <Link
                                                key={product._id || product.id}
                                                to={`/product/${product._id || product.id}`}
                                                onClick={() => setSearchQuery('')}
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                            >
                                                <img
                                                    src={product.image || `${API_BASE_URL}/products/${product._id || product.id}/image`}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                                                    alt={product.title}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">
                                                        {t(product, 'title')}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        ₹{Number(product.price).toFixed(0)}
                                                    </p>
                                                </div>
                                            </Link>
                                        ));
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : categoryProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {categoryProducts.map(product => (
                                <SimpleProductCard key={product._id || product.id} product={product} />
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
                                {t('We couldn\'t find any products in this category.')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PullToRefreshLayout>
    );
};

export default CategoryProducts;
