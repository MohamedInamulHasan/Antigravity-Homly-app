import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';
import { useLanguage } from '../context/LanguageContext';
import SimpleProductCard from '../components/SimpleProductCard';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const { ads, products, categories, fetchCategories } = useData();
    const { t } = useLanguage();
    const navigate = useNavigate();

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Use ads from backend only, no dummy fallback
    const slides = (ads && ads.length > 0) ? ads : [];

    // Group products by category - with safety check
    const groupedProducts = (products && Array.isArray(products))
        ? products.reduce((acc, product) => {
            const category = product.category || 'Other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {})
        : {};

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

    // All categories for the grid
    const allCategories = categories && categories.length > 0 ? categories : [];

    return (
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
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
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
                                            src={category.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop'}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                                                src={product.image}
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

                {/* Product Sections by Category */}
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

    if (!products || products.length === 0) return null;

    // Get category image from first product or use default
    const categoryImage = products[0]?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop';

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
