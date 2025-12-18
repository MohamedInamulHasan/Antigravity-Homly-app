import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../utils/api';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
    // Products State - load from localStorage for instant display
    const [products, setProducts] = useState(() => {
        try {
            const saved = localStorage.getItem('products');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
            return [];
        } catch (e) {
            console.error("Failed to parse products from local storage", e);
            return [];
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
            return [];
        } catch (e) {
            console.error("Failed to parse stores from local storage", e);
            return [];
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

    // Orders State - will be populated from backend
    const [orders, setOrders] = useState([]);

    // News State - will be populated from backend
    const [news, setNews] = useState(() => {
        try {
            const saved = localStorage.getItem('news');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
            return [];
        } catch (e) {
            console.error("Failed to parse news from local storage", e);
            return [];
        }
    });

    // Ads State - will be populated from backend
    const [ads, setAds] = useState(() => {
        try {
            const saved = localStorage.getItem('ads');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
            return [];
        } catch (e) {
            console.error("Failed to parse ads from local storage", e);
            return [];
        }
    });

    // Categories State
    const [categories, setCategories] = useState([]);

    // Users State
    const [users, setUsers] = useState([]);

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
                    try {
                        localStorage.setItem('stores', JSON.stringify(response.data));
                    } catch (e) {
                        console.error('Failed to save stores to local storage', e);
                    }
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
                    try {
                        localStorage.setItem('news', JSON.stringify(response.data));
                    } catch (e) {
                        console.error('Failed to save news to local storage', e);
                    }
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
                // localStorage.setItem('orders', JSON.stringify(response.data)); // Disabled due to QuotaExceededError
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
                    try {
                        localStorage.setItem('ads', JSON.stringify(response.data));
                    } catch (e) {
                        console.error('Failed to save ads to local storage', e);
                    }
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
    useEffect(() => {
        if (products.length > 0) {
            try {
                localStorage.setItem('products', JSON.stringify(products));
            } catch (e) {
                console.error('Failed to save products to localStorage', e);
                if (e.name === 'QuotaExceededError') {
                    console.warn('localStorage quota exceeded for products');
                }
            }
        }
    }, [products]);

    useEffect(() => {
        if (stores.length > 0) {
            try {
                localStorage.setItem('stores', JSON.stringify(stores));
            } catch (e) {
                console.error('Failed to save stores to local storage', e);
            }
        }
    }, [stores]);

    // useEffect(() => {
    //     localStorage.setItem('orders', JSON.stringify(orders));
    // }, [orders]);

    useEffect(() => {
        try {
            localStorage.setItem('news', JSON.stringify(news));
        } catch (e) {
            console.error('Failed to save news to local storage', e);
        }
    }, [news]);

    useEffect(() => {
        try {
            localStorage.setItem('ads', JSON.stringify(ads));
        } catch (e) {
            console.error('Failed to save ads to local storage', e);
        }
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
            console.log('🔄 DataContext: Sending order to API...', order);
            const response = await apiService.createOrder(order);
            console.log('📥 DataContext: Received response:', response);
            if (response.success && response.data) {
                setOrders(prev => [response.data, ...prev]);
                return response.data;
            }
        } catch (err) {
            console.error('❌ DataContext: Failed to add order:', err);
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

    // Category Management
    const fetchCategories = async () => {
        try {
            console.log('DataContext: Fetching categories...');
            const response = await apiService.getCategories();
            console.log('DataContext: Categories response:', response);
            if (response.success && response.data) {
                setCategories(response.data);
                console.log('DataContext: Categories set successfully, count:', response.data.length);
            }
        } catch (err) {
            console.error('DataContext: Failed to fetch categories - Full error:', err);
            throw err; // Propagate error to component
        }
    };

    const addCategory = async (category) => {
        try {
            console.log('DataContext: Adding category:', category);
            const response = await apiService.createCategory(category);
            console.log('DataContext: Add category response:', response);
            if (response.success && response.data) {
                setCategories(prev => [...prev, response.data]);
                return response.data;
            }
        } catch (err) {
            console.error('DataContext: Failed to add category - Full error:', err);
            throw err;
        }
    };

    const updateCategory = async (updatedCategory) => {
        try {
            const response = await apiService.updateCategory(updatedCategory._id || updatedCategory.id, updatedCategory);
            if (response.success && response.data) {
                setCategories(prev => prev.map(c => (c._id || c.id) === (response.data._id || response.data.id) ? response.data : c));
                return response.data;
            }
        } catch (err) {
            console.error('Failed to update category:', err);
            throw err;
        }
    };

    const deleteCategory = async (id) => {
        try {
            await apiService.deleteCategory(id);
            setCategories(prev => prev.filter(c => (c._id || c.id) !== id));
        } catch (err) {
            console.error('Failed to delete category:', err);
            throw err;
        }
    };

    // User Management
    const fetchUsers = async () => {
        try {
            console.log('DataContext: Fetching users...');
            const response = await apiService.getAllUsers();
            console.log('DataContext: Users response:', response);
            if (response.success && response.data) {
                setUsers(response.data);
                console.log('DataContext: Users set successfully, count:', response.data.length);
            }
        } catch (err) {
            console.error('DataContext: Failed to fetch users - Full error:', err);
            throw err; // Propagate error to component
        }
    };

    const updateUser = async (updatedUser) => {
        try {
            const response = await apiService.updateUser(updatedUser._id || updatedUser.id, updatedUser);
            if (response.success && response.data) {
                setUsers(prev => prev.map(u => (u._id || u.id) === (response.data._id || response.data.id) ? response.data : u));
                return response.data;
            }
        } catch (err) {
            console.error('Failed to update user:', err);
            throw err;
        }
    };

    const deleteUser = async (id) => {
        try {
            await apiService.deleteUser(id);
            setUsers(prev => prev.filter(u => (u._id || u.id) !== id));
        } catch (err) {
            console.error('Failed to delete user:', err);
            throw err;
        }
    };

    const value = {
        products,
        stores,
        orders,
        news,
        ads,
        categories,
        users,
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
        deleteOrder,
        cancelOrder,
        refreshOrders: fetchOrders,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        fetchUsers,
        updateUser,
        deleteUser,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
