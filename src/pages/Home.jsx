import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import ProductList from '../components/ProductList';
import { useData } from '../context/DataContext';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { products: allProducts } = useData();

    const categoryFilter = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    const [mobileSearchTerm, setMobileSearchTerm] = useState(searchQuery || '');

    const slides = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
            title: 'Summer Collection 2024',
            subtitle: 'Discover the latest trends in fashion.'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop',
            title: 'Modern Electronics',
            subtitle: 'Upgrade your lifestyle with new tech.'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2070&auto=format&fit=crop',
            title: 'Cozy Home Living',
            subtitle: 'Make your home your sanctuary.'
        }
    ];

    const categories = [
        { name: 'All' },
        { name: 'Electronics' },
        { name: 'Fashion' },
        { name: 'Home' },
        { name: 'Beauty' },
        { name: 'Sports' },
        { name: 'Toys' },
        { name: 'Books' },
        { name: 'Automotive' },
    ];

    useEffect(() => {
        let filtered = [...allProducts];

        if (categoryFilter && categoryFilter !== 'All') {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // If no filters, show only 4 featured products
        if (!categoryFilter && !searchQuery) {
            setDisplayedProducts(filtered.slice(0, 4));
        } else {
            setDisplayedProducts(filtered);
        }
    }, [categoryFilter, searchQuery, allProducts]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleCategoryClick = (categoryName) => {
        // If category is already selected, do nothing
        if (categoryFilter === categoryName) {
            return;
        }

        // Selecting new category
        let url = `/?category=${encodeURIComponent(categoryName)}`;
        if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        navigate(url);
    };

    const handleMobileSearch = (e) => {
        e.preventDefault();
        let url = '/';
        if (mobileSearchTerm) {
            url += `?search=${encodeURIComponent(mobileSearchTerm)}`;
        }
        if (categoryFilter) {
            url += `${mobileSearchTerm ? '&' : '?'}category=${encodeURIComponent(categoryFilter)}`;
        }
        navigate(url);
    };

    const getSectionTitle = () => {
        if (searchQuery) return `Search Results for "${searchQuery}"`;
        if (categoryFilter === 'All') return 'All Products';
        if (categoryFilter) return `${categoryFilter} Products`;
        return 'Featured Products';
    };

    return (
        <div className="space-y-8 pb-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200 min-h-screen">
            {/* Image Slider - Always visible */}
            {true && (
                <section className="relative h-[400px] md:h-[500px] overflow-hidden group">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center text-white p-4">
                                <h2 className="text-4xl md:text-6xl font-bold mb-4 transform translate-y-0 transition-transform duration-700">
                                    {slide.title}
                                </h2>
                                <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                                <Link
                                    to="/store"
                                    className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                    ))}

                    {/* Slider Controls */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Horizontal Scrollable Categories (Text Pills) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
                    {(categoryFilter || searchQuery) && (
                        <button
                            onClick={() => navigate('/')}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            onClick={() => handleCategoryClick(category.name)}
                            className={`flex-shrink-0 px-6 py-3 rounded-full border cursor-pointer transition-all duration-300 ${categoryFilter === category.name
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:border-blue-600'
                                }`}
                        >
                            <span className="font-medium whitespace-nowrap">
                                {category.name}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Product Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mobile Search Bar */}
                <div className="md:hidden mb-6">
                    <form onSubmit={handleMobileSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={mobileSearchTerm}
                            onChange={(e) => setMobileSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </form>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getSectionTitle()}</h2>

                </div>

                {displayedProducts.length > 0 ? (
                    <ProductList products={displayedProducts} />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-500 dark:text-gray-400">No products found.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
