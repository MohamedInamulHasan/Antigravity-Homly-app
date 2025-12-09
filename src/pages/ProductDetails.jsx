import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Plus, ArrowLeft, Minus, ShoppingBag, ShoppingCart, ChevronLeft, ChevronRight, Star, Share2, Heart } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartItems, updateQuantity } = useCart();
    const { products } = useData();
    const { t } = useLanguage();

    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (products.length > 0) {
            const foundProduct = products.find(p => (p._id || p.id) === id || (p._id || p.id) === parseInt(id));
            setProduct(foundProduct);
            setCurrentImageIndex(0);
        }
    }, [id, products]);

    const productId = product ? (product._id || product.id) : null;
    const cartItem = product ? cartItems.find(item => item.id === productId) : null;
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleCheckout = () => {
        if (!cartItem) {
            addToCart(product);
        }
        navigate('/checkout');
    };

    const handleScroll = (e) => {
        const container = e.target;
        const slideIndex = Math.round(container.scrollLeft / container.clientWidth);
        setCurrentImageIndex(slideIndex);
    };

    const scrollToImage = (index) => {
        const container = document.getElementById('product-slider');
        if (container) {
            container.scrollTo({
                left: index * container.clientWidth,
                behavior: 'smooth'
            });
            setCurrentImageIndex(index);
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4 transition-colors duration-200">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('Product not found')}</h2>
                <Link to="/store" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">{t('Return to Store')}</Link>
            </div>
        );
    }

    const images = product.images || [product.image];
    const totalPrice = (Number(product.price) * (quantity || 1)).toFixed(0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 pb-24 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    >
                        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                        <span className="font-medium">{t('Back')}</span>
                    </button>
                    <div className="flex gap-4">
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Heart size={24} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                            <Share2 size={24} />
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Slider Section */}
                        <div className="relative aspect-square lg:aspect-auto lg:h-[600px] group">
                            <div
                                id="product-slider"
                                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full"
                                onScroll={handleScroll}
                                style={{ scrollBehavior: 'smooth' }}
                            >
                                {images.map((img, idx) => (
                                    <div key={idx} className="min-w-full h-full snap-center flex items-center justify-center">
                                        <img
                                            src={img}
                                            alt={`${product.title} - ${t('View')} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Slider Controls */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => scrollToImage(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full text-gray-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black/70 z-10"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => scrollToImage(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full text-gray-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black/70 z-10"
                                    >
                                        <ChevronRight size={24} />
                                    </button>

                                    {/* Dots */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => scrollToImage(idx)}
                                                className={`w-2.5 h-2.5 rounded-full transition-all ${currentImageIndex === idx
                                                    ? 'bg-blue-600 w-6'
                                                    : 'bg-white/60 hover:bg-white/80'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Product Info Section */}
                        <div className="p-8 lg:p-12 flex flex-col h-full">
                            <div className="mb-auto">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
                                        {t(product, 'category')}
                                    </span>
                                    <div className="flex items-center text-yellow-400 text-sm font-bold">
                                        <Star size={16} className="fill-current" />
                                        <span className="ml-1 text-gray-600 dark:text-gray-400">4.8 (120 reviews)</span>
                                    </div>
                                </div>

                                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                                    {t(product, 'title')}
                                </h1>

                                <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-baseline gap-2">
                                    ₹{Number(product.price).toFixed(0)}
                                    <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">/ unit</span>
                                </div>

                                <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {t(product, 'description')}
                                    </p>
                                </div>

                                {/* Quantity & Total Section */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-gray-900 dark:text-white font-medium">{t('Quantity')}</span>
                                        <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                                            <button
                                                onClick={() => {
                                                    if (cartItem) {
                                                        updateQuantity(productId, Math.max(0, quantity - 1));
                                                    }
                                                }}
                                                className={`w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors ${quantity <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}
                                                disabled={quantity <= 0}
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                                            <button
                                                onClick={() => {
                                                    if (cartItem) {
                                                        updateQuantity(productId, quantity + 1);
                                                    } else {
                                                        addToCart(product);
                                                    }
                                                }}
                                                className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">{t('Total')}</span>
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{Number(totalPrice).toFixed(0)}</span>
                                    </div>
                                </div>

                                {/* Desktop Action Button */}
                                <div className="hidden md:block">
                                    <button
                                        onClick={quantity > 0 ? handleCheckout : () => addToCart(product)}
                                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 ${quantity > 0
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-none'
                                            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100'
                                            }`}
                                    >
                                        {quantity > 0 ? (
                                            <>
                                                <ShoppingBag size={22} />
                                                {t('Add to Cart')}
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart size={22} />
                                                {t('Add to Cart')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


            {/* Sticky Action Footer - Mobile Only */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={quantity > 0 ? handleCheckout : () => addToCart(product)}
                        className={`w-[90%] mx-auto block py-2.5 px-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 ${quantity > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-none'
                            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100'
                            }`}
                    >
                        {quantity > 0 ? (
                            <>
                                <ShoppingBag size={20} />
                                {t('Add to Cart')}
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={20} />
                                {t('Add to Cart')}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
