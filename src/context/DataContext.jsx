import { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';
import { stores as initialStores } from '../data/stores';
import { apiService } from '../utils/api';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
    // Products State
    const [products, setProducts] = useState(initialProducts);

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

    // Loading and Error States
    const [loading, setLoading] = useState({
        products: false,
        stores: false,
        news: false,
        orders: false,
    });

    const [error, setError] = useState({
        products: null,
        stores: null,
        news: null,
        orders: null,
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
                    category: "Offer"
                },
                {
                    id: 2,
                    title: "New Electronics Arrival",
                    description: "Check out the latest gadgets and tech accessories just landed in our store.",
                    image: "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?q=80&w=2070&auto=format&fit=crop",
                    date: "Nov 22, 2024",
                    category: "News"
                },
                {
                    id: 3,
                    title: "Buy 1 Get 1 Free on Accessories",
                    description: "Exclusive deal for premium members. Buy any accessory and get another one absolutely free!",
                    image: "https://images.unsplash.com/photo-1576158187551-b38898a4616d?q=80&w=2070&auto=format&fit=crop",
                    date: "Nov 20, 2024",
                    category: "Deal"
                },
                {
                    id: 4,
                    title: "Holiday Season Preview",
                    description: "Sneak peek into our upcoming holiday collection. Pre-order now to secure your favorites.",
                    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2070&auto=format&fit=crop",
                    date: "Nov 18, 2024",
                    category: "News"
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

    // Fetch data from API on mount
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(prev => ({ ...prev, products: true }));
            setError(prev => ({ ...prev, products: null }));
            try {
                const response = await apiService.getProducts();
                if (response.success && response.data) {
                    setProducts(response.data);
                    // localStorage.setItem('products', JSON.stringify(response.data)); // Disabled due to size limit
                }
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError(prev => ({ ...prev, products: err.message }));
                // Keep using localStorage data as fallback
            } finally {
                setLoading(prev => ({ ...prev, products: false }));
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchStores = async () => {
            setLoading(prev => ({ ...prev, stores: true }));
            setError(prev => ({ ...prev, stores: null }));
            try {
                const response = await apiService.getStores();
                if (response.success && response.data) {
                    setStores(response.data);
                    localStorage.setItem('stores', JSON.stringify(response.data));
                }
            } catch (err) {
                console.error('Failed to fetch stores:', err);
                setError(prev => ({ ...prev, stores: err.message }));
                // Keep using localStorage data as fallback
            } finally {
                setLoading(prev => ({ ...prev, stores: false }));
            }
        };

        fetchStores();
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(prev => ({ ...prev, news: true }));
            setError(prev => ({ ...prev, news: null }));
            try {
                const response = await apiService.getNews();
                if (response.success && response.data) {
                    setNews(response.data);
                    localStorage.setItem('news', JSON.stringify(response.data));
                }
            } catch (err) {
                console.error('Failed to fetch news:', err);
                setError(prev => ({ ...prev, news: err.message }));
                // Keep using localStorage data as fallback
            } finally {
                setLoading(prev => ({ ...prev, news: false }));
            }
        };

        fetchNews();
    }, []);

    const fetchOrders = async () => {
        setLoading(prev => ({ ...prev, orders: true }));
        setError(prev => ({ ...prev, orders: null }));
        try {
            const response = await apiService.getOrders();
            if (response.success && response.data) {
                setOrders(response.data);
                localStorage.setItem('orders', JSON.stringify(response.data));
            }
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            setError(prev => ({ ...prev, orders: err.message }));
            // Keep using localStorage data as fallback
        } finally {
            setLoading(prev => ({ ...prev, orders: false }));
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchAds = async () => {
            setLoading(prev => ({ ...prev, ads: true }));
            setError(prev => ({ ...prev, ads: null }));
            try {
                const response = await apiService.getAds();
                if (response.success && response.data) {
                    setAds(response.data);
                    localStorage.setItem('ads', JSON.stringify(response.data));
                }
            } catch (err) {
                console.error('Failed to fetch ads:', err);
                setError(prev => ({ ...prev, ads: err.message }));
                // Keep using localStorage data as fallback
            } finally {
                setLoading(prev => ({ ...prev, ads: false }));
            }
        };

        fetchAds();
    }, []);

    // Sync with localStorage when data changes
    /* 
    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem('products', JSON.stringify(products));
        }
    }, [products]);
    */

    useEffect(() => {
        if (stores.length > 0) {
            localStorage.setItem('stores', JSON.stringify(stores));
        }
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
    const addProduct = async (product) => {
        try {
            const response = await apiService.createProduct(product);
            if (response.success && response.data) {
                setProducts(prev => [...prev, response.data]);
                return response.data;
            }
        } catch (err) {
            console.error('Failed to add product:', err);
            throw err;
        }
    };

    const updateProduct = async (updatedProduct) => {
        try {
            const response = await apiService.updateProduct(updatedProduct._id || updatedProduct.id, updatedProduct);
            if (response.success && response.data) {
                setProducts(prev => prev.map(p => (p._id || p.id) === (response.data._id || response.data.id) ? response.data : p));
                return response.data;
            }
        } catch (err) {
            console.error('Failed to update product:', err);
            throw err;
        }
    };

    const deleteProduct = async (id) => {
        try {
            await apiService.deleteProduct(id);
            setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
        } catch (err) {
            console.error('Failed to delete product:', err);
            throw err;
        }
    };

    const addStore = async (store) => {
        try {
            const response = await apiService.createStore(store);
            if (response.success && response.data) {
                setStores(prev => [...prev, response.data]);
                return response.data;
            }
        } catch (err) {
            console.error('Failed to add store:', err);
            throw err;
        }
    };

    const updateStore = async (updatedStore) => {
        try {
            const response = await apiService.updateStore(updatedStore._id || updatedStore.id, updatedStore);
            if (response.success && response.data) {
                setStores(prev => prev.map(s => (s._id || s.id) === (response.data._id || response.data.id) ? response.data : s));
                return response.data;
            }
        } catch (err) {
            console.error('Failed to update store:', err);
            throw err;
        }
    };

    const addNews = async (newsItem) => {
        try {
            const response = await apiService.createNews(newsItem);
            if (response.success && response.data) {
                setNews(prev => [...prev, response.data]);
                return response.data;
            }
        } catch (err) {
            console.error('Failed to add news:', err);
            throw err;
        }
    };

    const updateNews = async (updatedNews) => {
        try {
            const response = await apiService.updateNews(updatedNews._id || updatedNews.id, updatedNews);
            if (response.success && response.data) {
                setNews(prev => prev.map(n => (n._id || n.id) === (response.data._id || response.data.id) ? response.data : n));
                return response.data;
            }
        } catch (err) {
            console.error('Failed to update news:', err);
            throw err;
        }
    };

    const updateOrder = async (updatedOrder) => {
        try {
            const response = await apiService.updateOrderStatus(updatedOrder._id || updatedOrder.id, updatedOrder.status);
            if (response.success && response.data) {
                setOrders(prev => prev.map(o => (o._id || o.id) === (response.data._id || response.data.id) ? response.data : o));
                return response.data;
            }
        } catch (err) {
            console.error('Failed to update order:', err);
            throw err;
        }
    };

    const addOrder = async (order) => {
        try {
            const response = await apiService.createOrder(order);
            if (response.success && response.data) {
                setOrders(prev => [response.data, ...prev]);
                return response.data;
            }
        } catch (err) {
            console.error('Failed to add order:', err);
            throw err;
        }
    };

    const addAd = async (ad) => {
        try {
            const response = await apiService.createAd(ad);
            if (response.success && response.data) {
                setAds(prev => [response.data, ...prev]);
                return response.data;
            }
        } catch (err) {
            console.error('Failed to add ad:', err);
            throw err;
        }
    };

    const deleteAd = async (id) => {
        try {
            await apiService.deleteAd(id);
            setAds(prev => prev.filter(ad => (ad._id || ad.id) !== id));
        } catch (err) {
            console.error('Failed to delete ad:', err);
            throw err;
        }
    };

    const deleteStore = async (id) => {
        try {
            await apiService.deleteStore(id);
            setStores(prev => prev.filter(s => (s._id || s.id) !== id));
        } catch (err) {
            console.error('Failed to delete store:', err);
            throw err;
        }
    };

    const deleteNews = async (id) => {
        try {
            await apiService.deleteNews(id);
            setNews(prev => prev.filter(n => (n._id || n.id) !== id));
        } catch (err) {
            console.error('Failed to delete news:', err);
            throw err;
        }
    };

    const deleteOrder = async (id) => {
        try {
            await apiService.deleteOrder(id);
            setOrders(prev => prev.filter(o => (o._id || o.id) !== id));
        } catch (err) {
            console.error('Failed to delete order:', err);
            throw err;
        }
    };

    const cancelOrder = async (id) => {
        try {
            const response = await apiService.updateOrderStatus(id, 'Cancelled');
            if (response.success && response.data) {
                setOrders(prev => prev.map(o => (o._id || o.id) === id ? { ...o, status: 'Cancelled' } : o));
                return response.data;
            }
        } catch (err) {
            console.error('Failed to cancel order:', err);
            throw err;
        }
    };

    const value = {
        products,
        stores,
        orders,
        news,
        ads,
        loading,
        error,
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
        addAd,
        deleteAd,
        deleteOrder,
        cancelOrder,
        refreshOrders: fetchOrders,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
