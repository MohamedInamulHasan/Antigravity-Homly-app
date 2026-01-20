import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx'; // Keep for now if other things need it, or remove if unused.
import { useProducts } from '../hooks/queries/useProducts';
import { useAds } from '../hooks/queries/useAds';
import { useCategories } from '../hooks/queries/useCategories';
import { useStores } from '../hooks/queries/useStores';
import { useLanguage } from '../context/LanguageContext';
import { isStoreOpen } from '../utils/storeHelpers';
import { API_BASE_URL } from '../utils/api';
import SimpleProductCard from '../components/SimpleProductCard';
import PullToRefreshLayout from '../components/PullToRefreshLayout';
import { API_BASE_URL } from '../utils/api';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // React Query Hooks
    const { data: rawProducts = [], isLoading: loadingProducts, error: errorProducts } = useProducts();
    const { data: ads = [], isLoading: loadingAds } = useAds();
    const { data: rawCategories = [] } = useCategories();
    const { data: rawStores = [] } = useStores();

    const categories = Array.isArray(rawCategories) ? rawCategories : (rawCategories?.data || []);
    const stores = Array.isArray(rawStores) ? rawStores : (rawStores?.data || []);

    // Map products from raw data (handling potential nesting)
    const products = Array.isArray(rawProducts) ? rawProducts : (rawProducts?.data || []);

    console.log('🏠 Home: Products Count:', products.length);
    console.log('🏠 Home: Loading:', loadingProducts);

    const { t } = useLanguage();
    const navigate = useNavigate();

    // Use ads from backend only
    const slides = (ads && ads.length > 0) ? ads : [];


    // Filter products to only show from open stores
    // TEMPORARILY DISABLED - Show all products regardless of store hours
    const openStoreProducts = (products && Array.isArray(products))
        ? products
        : [];

    /* Original code with store hours filter:
    const openStoreProducts = (products && Array.isArray(products) && stores)
        ? products.filter(product => {
            // Find the store for this product
            const productStoreId = product.storeId?._id || product.storeId;
            const productStore = stores.find(s => (s._id || s.id) === productStoreId);
            // Only include products from open stores
            return productStore && isStoreOpen(productStore);
        })
        : [];
    */

    // Group products by category - with safety check
    const groupedProducts = openStoreProducts.reduce((acc, product) => {
        const category = product.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    // Auto-scroll functionality for hero slider
    useEffect(() => {
        const timer = setInterval(() => {
            const container = document.getElementById('hero-slider');
            if (container) {
                const scrollAmount = container.clientWidth;
                const maxScroll = container.scrollWidth - container.clientWidth;

                if (container.scrollLeft >= maxScroll) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                    setCurrentSlide(0);
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    setCurrentSlide(prev => prev + 1);
                }
            }
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleScroll = (e) => {
        const container = e.target;
        const slideIndex = Math.round(container.scrollLeft / container.clientWidth);
        setCurrentSlide(slideIndex);
    };

    const scrollToSlide = (index) => {
        const container = document.getElementById('hero-slider');
        if (container) {
            container.scrollTo({
                left: index * container.clientWidth,
                behavior: 'smooth'
            });
            setCurrentSlide(index);
        }
    };

    const allCategories = categories && categories.length > 0 ? categories : [];

    // LOADING STATE: Removed blocking spinner. Now we show the layout immediately.
    // The spinner will appear inside the product lists instead.

    /* 
    if (loadingProducts && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-500 animate-pulse">{t('Loading products...')}</p>
                <p className="text-xs text-red-500 mt-2">
                    Debug: {loadingProducts ? 'Loading' : 'Loaded'} |
                    Items: {products?.length || 0} |
                    Error: {errorProducts ? errorProducts.message : 'None'}
                </p>
            </div>
        );
    } 
    */

    // Show error state if backend is unreachable
    if (!loadingProducts && products.length === 0 && errorProducts) {
        return (
            <PullToRefreshLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('Connection Failed')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
                        {t('We surely missed the server! Please make sure the backend is running.')}
                        <br />
                        <span className="text-sm font-mono mt-2 block bg-gray-100 dark:bg-gray-800 p-2 rounded">
                            {errorProducts?.message || 'Unknown Error'}
                        </span>
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition"
                    >
                        {t('Retry Connection')}
                    </button>
                </div>
            </PullToRefreshLayout>
        );
    }

    return (
        <PullToRefreshLayout>
            <div className="space-y-6 pb-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200 min-h-screen">
                {/* Hero Slider - Only show if slides exist */}
                {slides.length > 0 && (
                    <section className="relative h-[250px] md:h-[500px] group">
                        <div
                            id="hero-slider"
                            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full"
                            onScroll={handleScroll}
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {slides.map((slide) => (
                                <div
                                    key={slide.id}
                                    className="min-w-full h-full relative snap-center"
                                >
                                    <img
                                        src={slide.image || `${API_BASE_URL}/ads/${slide._id || slide.id}/image`}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Slider Controls */}
                        <button
                            onClick={() => scrollToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={() => scrollToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </section>
                )}


                {/* Categories Section - Round Images Grid Below Slider */}
                {allCategories.length > 0 && (
                    <section className="bg-gray-50 dark:bg-gray-900 py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                {t('Shop by Category')}
                            </h2>
                            {/* Grid: 3 columns on mobile, 4 on tablet, 6 on desktop, 8 on xl screens */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
                                {allCategories.map((category) => (
                                    <Link
                                        key={category._id || category.id}
                                        to={`/store?category=${encodeURIComponent(category.name)}`}
                                        className="flex flex-col items-center gap-2 md:gap-3 group"
                                    >
                                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ring-4 ring-white dark:ring-gray-800 group-hover:ring-blue-500">
                                            <img
                                                src={category.image || `${API_BASE_URL}/categories/${category._id || category.id}/image`}
                                                alt={category.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                        <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-white text-center max-w-full group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {t(category.name)}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Mobile Search Bar - Below Categories */}
                <section className="md:hidden bg-white dark:bg-gray-800 py-4 sticky top-0 z-20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="relative">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (searchQuery.trim()) {
                                        navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                                        setSearchQuery('');
                                    }
                                }}
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
                                        const filteredProducts = products.filter(product =>
                                            product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            product.category?.toLowerCase().includes(searchQuery.toLowerCase())
                                        ).slice(0, 5);

                                        if (filteredProducts.length === 0) {
                                            return (
                                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                    {t('No products found')}
                                                </div>
                                            );
                                        }

                                        return filteredProducts.map((product) => (
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
                </section>

                {/* Main Content Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">


                    {/* Loading State for Products - Inline */}
                    {loadingProducts && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-500 animate-pulse">{t('Loading products...')}</p>
                        </div>
                    )}

                    {/* Product Sections by Category */}
                    {!loadingProducts && Object.entries(groupedProducts).length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            {t('No products found')}
                        </div>
                    )}

                    {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                        <CategorySection
                            key={category}
                            category={category}
                            products={categoryProducts.slice(0, 10)}
                            t={t}
                        />
                    ))}
                </div>
            </div>
        </PullToRefreshLayout>
    );
};

// Category Section Component
const CategorySection = ({ category, products, t }) => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    console.log(`🏠 Home: CategorySection [${category}] - Products:`, products?.length);

    // If no products, we check if it is still initial loading?
    // Since we removed the global blocker, we need to handle empty states gracefully here.
    if (!products || products.length === 0) {
        return (
            <section className="relative space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t(category)}</h2>
                </div>
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </section>
        );
    }

    // Get category image from first product or use default
    const categoryImage = products[0]?.image;

    return (
        <section className="relative space-y-4">
            {/* Category Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {t(category)}
                </h2>
                <Link
                    to={`/store?category=${encodeURIComponent(category)}`}
                    className="text-sm md:text-base text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                    {t('View All')} →
                </Link>
            </div>

            {/* Products Carousel */}
            <div className="relative group">
                {/* Scroll Buttons - Desktop Only */}
                <button
                    onClick={() => scroll('left')}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    aria-label="Scroll right"
                >
                    <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
                </button>

                {/* Scrollable Products Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-3 md:gap-4 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product._id || product.id}
                            className="flex-none w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] snap-start"
                        >
                            <SimpleProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Home;
