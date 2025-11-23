import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { Plus, ArrowLeft, Minus, ShoppingBag, ShoppingCart, ChevronLeft, ChevronRight, Star, Share2, Heart } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartItems, updateQuantity } = useCart();
    const { products } = useData();

    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (products.length > 0) {
            const foundProduct = products.find(p => p.id === parseInt(id));
            setProduct(foundProduct);
            setCurrentImageIndex(0);
        }
    }, [id, products]);

    const cartItem = product ? cartItems.find(item => item.id === product.id) : null;
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleCheckout = () => {
        if (!cartItem) {
            addToCart(product);
        }
        navigate('/cart');
    };

    const nextImage = () => {
        if (product?.images) {
            setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        }
    };

    const prevImage = () => {
        if (product?.images) {
            setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-4 transition-colors duration-200">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
                <Link to="/store" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">Return to Store</Link>
            </div>
        );
    }

    const images = product.images || [product.image];
    const totalPrice = (product.price * (quantity || 1)).toFixed(2);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    >
                        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                        <span className="font-medium">Back</span>
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

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Image Slider Section */}
                        <div className="relative bg-gray-100 dark:bg-gray-700 aspect-square lg:aspect-auto lg:h-[600px] group">
                            <img
                                src={images[currentImageIndex]}
                                alt={`${product.title} - View ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover transition-opacity duration-300"
                            />

                            {/* Slider Controls */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full text-gray-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black/70"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full text-gray-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black/70"
                                    >
                                        <ChevronRight size={24} />
                                    </button>

                                    {/* Dots */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                        {images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
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
                                        {product.category}
                                    </span>
                                    <div className="flex items-center text-yellow-400 text-sm font-bold">
                                        <Star size={16} className="fill-current" />
                                        <span className="ml-1 text-gray-600 dark:text-gray-400">4.8 (120 reviews)</span>
                                    </div>
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                                    {product.title}
                                </h1>

                                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-baseline gap-2">
                                    ₹{product.price.toFixed(2)}
                                    <span className="text-lg text-gray-500 dark:text-gray-400 font-normal">/ unit</span>
                                </div>

                                <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                                {quantity > 0 ? (
                                    <div className="space-y-6">
                                        {/* Quantity Control */}
                                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl">
                                            <span className="font-medium text-gray-700 dark:text-gray-200">Quantity</span>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 shadow-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-xl text-gray-900 dark:text-white">{quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 shadow-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total and Checkout */}
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                                            <div className="flex justify-between items-end mb-6">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Price</p>
                                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                        ₹{totalPrice}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Items</p>
                                                    <p className="font-bold text-gray-900 dark:text-white">{quantity} pcs</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleCheckout}
                                                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                                            >
                                                <ShoppingBag size={20} />
                                                Proceed to Checkout
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-3"
                                    >
                                        <ShoppingCart size={24} />
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
