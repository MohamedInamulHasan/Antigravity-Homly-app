import { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';
import { stores as initialStores } from '../data/stores';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
    // Products State
    const [products, setProducts] = useState(() => {
        try {
            const saved = localStorage.getItem('products');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
            return initialProducts;
        } catch (e) {
            console.error("Failed to parse products from local storage", e);
            return initialProducts;
        }
    });

    // Stores State
    const [stores, setStores] = useState(() => {
        try {
            const saved = localStorage.getItem('stores');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
            return initialStores;
        } catch (e) {
            console.error("Failed to parse stores from local storage", e);
            return initialStores;
        }
    });

    // Orders State
    const [orders, setOrders] = useState(() => {
        try {
            const saved = localStorage.getItem('orders');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
            return [
                {
                    id: 'ORD-2024-001',
                    date: 'Nov 20, 2024',
                    total: 129.99,
                    status: 'Delivered',
                    user: 'John Doe',
                    shippingAddress: {
                        name: 'John Doe',
                        street: '123 Main St',
                        city: 'New York',
                        state: 'NY',
                        zip: '10001',
                        country: 'United States'
                    },
                    paymentMethod: {
                        type: 'Visa',
                        last4: '4242'
                    },
                    items: [
                        { name: 'Wireless Noise-Canceling Headphones', quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop' },
                        { name: 'Smart Fitness Tracker', quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop' }
                    ],
                    subtotal: 179.98,
                    shipping: 0.00,
                    tax: 14.40,
                    discount: -64.39
                },
                {
                    id: 'ORD-2024-002',
                    date: 'Nov 15, 2024',
                    total: 59.50,
                    status: 'Shipped',
                    user: 'Jane Smith',
                    shippingAddress: {
                        name: 'Jane Smith',
                        street: '456 Oak Ave',
                        city: 'Los Angeles',
                        state: 'CA',
                        zip: '90001',
                        country: 'United States'
                    },
                    paymentMethod: {
                        type: 'Mastercard',
                        last4: '8888'
                    },
                    items: [
                        { name: 'Classic Leather Watch', quantity: 1, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1999&auto=format&fit=crop' }
                    ],
                    subtotal: 59.50,
                    shipping: 5.00,
                    tax: 4.50,
                    discount: 0.00
                },
                {
                    id: 'ORD-2024-003',
                    date: 'Nov 10, 2024',
                    total: 24.99,
                    status: 'Processing',
                    user: 'Mike Johnson',
                    shippingAddress: {
                        name: 'Mike Johnson',
                        street: '789 Pine Ln',
                        city: 'Chicago',
                        state: 'IL',
                        zip: '60601',
                        country: 'United States'
                    },
                    paymentMethod: {
                        type: 'PayPal',
                        last4: 'mike@example.com'
                    },
                    items: [
                        { name: 'Soft Throw Blanket', quantity: 2, image: 'https://images.unsplash.com/photo-1580301762395-9c64265e9c5d?q=80&w=2070&auto=format&fit=crop' }
                    ],
                    subtotal: 25.00,
                    shipping: 0.00,
                    tax: 2.00,
                    discount: -2.01
                },
                {
                    id: 'ORD-2024-004',
                    date: 'Oct 25, 2024',
                    total: 199.00,
                    status: 'Cancelled',
                    user: 'Sarah Williams',
                    shippingAddress: {
                        name: 'Sarah Williams',
                        street: '321 Elm St',
                        city: 'Miami',
                        state: 'FL',
                        zip: '33101',
                        country: 'United States'
                    },
                    paymentMethod: {
                        type: 'Visa',
                        last4: '1234'
                    },
                    items: [
                        { name: 'Premium Coffee Maker', quantity: 1, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop' }
                    ],
                    subtotal: 199.00,
                    shipping: 10.00,
                    tax: 15.00,
                    discount: 0.00
                }
            ];
        } catch (e) {
            console.error("Failed to parse orders from local storage", e);
            return [];
        }
    });

    // News State
    const [news, setNews] = useState(() => {
        try {
            const saved = localStorage.getItem('news');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
            return [
                {
                    id: 1,
                    title: "Summer Sale Extravaganza!",
                    description: "Get up to 50% off on all summer collections. Limited time offer.",
                    image: "https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=2070&auto=format&fit=crop",
                    date: "Nov 24, 2024",
                    category: "Offer",
                    category_ta: "சலுகை",
                    title_ta: "கோடை விற்பனை கொண்டாட்டம்!",
                    description_ta: "அனைத்து கோடை சேகரிப்புகளிலும் 50% வரை தள்ளுபடி பெறுங்கள். குறைந்த நேர சலுகை."
                },
                {
                    id: 2,
                    title: "New Electronics Arrival",
                    description: "Check out the latest gadgets and tech accessories just landed in our store.",
                    image: "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?q=80&w=2070&auto=format&fit=crop",
                    date: "Nov 22, 2024",
                    category: "News",
                    category_ta: "செய்திகள்",
                    title_ta: "புதிய எலக்ட்ரானிக்ஸ் வருகை",
                    description_ta: "எங்கள் கடையில் வந்து இறங்கிய சமீபத்திய கேஜெட்டுகள் மற்றும் தொழில்நுட்ப பாகங்களைச் சரிபார்க்கவும்."
                },
                {
                    id: 3,
                    title: "Buy 1 Get 1 Free on Accessories",
                    description: "Exclusive deal for premium members. Buy any accessory and get another one absolutely free!",
                    image: "https://images.unsplash.com/photo-1576158187551-b38898a4616d?q=80&w=2070&auto=format&fit=crop",
                    date: "Nov 20, 2024",
                    category: "Deal",
                    category_ta: "ஒப்பந்தம்",
                    title_ta: "துணைக்கருவிகளில் 1 வாங்கினால் 1 இலவசம்",
                    description_ta: "பிரீமியம் உறுப்பினர்களுக்கான பிரத்யேக ஒப்பந்தம். ஏதேனும் ஒரு துணைப்பொருளை வாங்கி மற்றொன்றை முற்றிலும் இலவசமாகப் பெறுங்கள்!"
                },
                {
                    id: 4,
                    title: "Holiday Season Preview",
                    description: "Sneak peek into our upcoming holiday collection. Pre-order now to secure your favorites.",
                    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2070&auto=format&fit=crop",
                    date: "Nov 18, 2024",
                    category: "News",
                    category_ta: "செய்திகள்",
                    title_ta: "விடுமுறை கால முன்னோட்டம்",
                    description_ta: "எங்கள் வரவிருக்கும் விடுமுறை சேகரிப்பில் ஒரு முன்னோட்டம். உங்களுக்குப் பிடித்தவைகளைப் பாதுகாக்க இப்போதே முன்கூட்டியே ஆர்டர் செய்யுங்கள்."
                }
            ];
        } catch (e) {
            console.error("Failed to parse news from local storage", e);
            return [];
        }
    });

    // Ads State
    const [ads, setAds] = useState(() => {
        try {
            const saved = localStorage.getItem('ads');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
            return [
                { id: 1, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop', title: 'Special Offer' },
                { id: 2, image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop', title: 'New Collection' },
                { id: 3, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop', title: 'Best Sellers' }
            ];
        } catch (e) {
            console.error("Failed to parse ads from local storage", e);
            return [];
        }
    });

    // Sync with localStorage
    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('stores', JSON.stringify(stores));
    }, [stores]);

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('news', JSON.stringify(news));
    }, [news]);

    useEffect(() => {
        localStorage.setItem('ads', JSON.stringify(ads));
    }, [ads]);

    // Actions
    const addProduct = (product) => {
        setProducts(prev => [...prev, { ...product, id: prev.length + 1 }]);
    };

    const updateProduct = (updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const addStore = (store) => {
        setStores(prev => [...prev, { ...store, id: prev.length + 1 }]);
    };

    const updateStore = (updatedStore) => {
        setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
    };

    const addNews = (newsItem) => {
        setNews(prev => [...prev, { ...newsItem, id: prev.length + 1 }]);
    };

    const updateNews = (updatedNews) => {
        setNews(prev => prev.map(n => n.id === updatedNews.id ? updatedNews : n));
    };

    const updateOrder = (updatedOrder) => {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    };

    const addOrder = (order) => {
        setOrders(prev => [order, ...prev]);
    };

    const addAd = (ad) => {
        setAds(prev => [...prev, { ...ad, id: Date.now() }]);
    };

    const deleteAd = (id) => {
        setAds(prev => prev.filter(ad => ad.id !== id));
    };

    const deleteStore = (id) => {
        setStores(prev => prev.filter(s => s.id !== id));
    };

    const deleteNews = (id) => {
        setNews(prev => prev.filter(n => n.id !== id));
    };

    const value = {
        products,
        stores,
        orders,
        news,
        ads,
        addProduct,
        updateProduct,
        deleteProduct,
        addStore,
        updateStore,
        deleteStore,
        addNews,
        updateNews,
        deleteNews,

        updateOrder,
        addOrder,
        addAd,
        deleteAd,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
