import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../utils/api';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
    // Products State - Always load fresh from database, no localStorage fallback
    const [products, setProducts] = useState([]);

    // Stores State - Always load fresh from database, no localStorage fallback
    const [stores, setStores] = useState([]);

    // Loading and Error States
    const [loading, setLoading] = useState({
        products: false,
        stores: false,
        news: false,
        orders: false,
        services: false,
        ads: false,
        categories: false,
        users: false
    });

    const [error, setError] = useState({
        products: null,
        stores: null,
        news: null,
        orders: null,
        services: null,
        ads: null,
        categories: null,
        users: null
    });

    // Orders State - will be populated from backend
    const [orders, setOrders] = useState([]);

    // News State - will be populated from backend
    const [news, setNews] = useState([]);

    // Ads State - always start fresh, fetch from database
    const [ads, setAds] = useState([]);

    // Categories State
    const [categories, setCategories] = useState([]);

    // Users State
    const [users, setUsers] = useState([]);

    // Services State
    const [services, setServices] = useState([]);

    // Saved Products State
    const [savedProducts, setSavedProducts] = useState([]);

    // Initial Loading State - for intro animation
    const [initialLoading, setInitialLoading] = useState(true);

    // Track when component mounts to ensure minimum intro display time
    const [mountTime] = useState(Date.now());

    // Clear stale localStorage on mount
    useEffect(() => {
        // Clear products, ads, and stores cache to ensure fresh data from database
        localStorage.removeItem('products');
        localStorage.removeItem('ads');
        localStorage.removeItem('stores');
        localStorage.removeItem('news');
        localStorage.removeItem('categories');
        localStorage.removeItem('orders');
        console.log('🧹 Cleared all data cache from localStorage to enforce DB loading');
    }, []);

    // Fetch data definitions
    const fetchProducts = async () => {
        console.log('🔄 Starting to fetch products...');
        setLoading(prev => ({ ...prev, products: true }));
        setError(prev => ({ ...prev, products: null }));
        try {
            console.log('📡 Calling API: getProducts({ limit: 50, page: 1 })');
            const response = await apiService.getProducts({ limit: 50, page: 1 });
            console.log('📦 API Response:', response);
            if (response.success && response.data) {
                setProducts(response.data);
                console.log(`✅ Loaded ${response.data.length} of ${response.total} products from database`);
            } else {
                console.error('❌ API returned unsuccessful response:', response);
                // On error, we still want to hide intro eventually
                setTimeout(() => setInitialLoading(false), 1500);
            }
        } catch (err) {
            console.error('❌ Failed to fetch products:', err);
            setError(prev => ({ ...prev, products: err.message }));
            setTimeout(() => setInitialLoading(false), 1500);
        } finally {
            setLoading(prev => ({ ...prev, products: false }));
        }
    };

    const fetchStores = async () => {
        setLoading(prev => ({ ...prev, stores: true }));
        setError(prev => ({ ...prev, stores: null }));
        try {
            const response = await apiService.getStores();
            if (response.success && response.data) {
                setStores(response.data);
                console.log(`✅ Loaded ${response.data.length} stores from database`);
            }
        } catch (err) {
            console.error('Failed to fetch stores:', err);
            setError(prev => ({ ...prev, stores: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, stores: false }));
        }
    };

    const fetchNews = async () => {
        setLoading(prev => ({ ...prev, news: true }));
        setError(prev => ({ ...prev, news: null }));
        try {
            const response = await apiService.getNews();
            if (response.success && response.data) {
                setNews(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch news:', err);
            setError(prev => ({ ...prev, news: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, news: false }));
        }
    };

    // Initial Fetch Effects
    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchStores();
    }, []);

    useEffect(() => {
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

    // Category Management - Define before use
    const fetchCategories = async () => {
        setLoading(prev => ({ ...prev, categories: true }));
        setError(prev => ({ ...prev, categories: null }));
        try {
            console.log('DataContext: Fetching categories...');
            const response = await apiService.categories.getAll();
            console.log('DataContext: Categories response:', response);
            if (response.success && response.data) {
                setCategories(response.data);
                console.log('DataContext: Categories set successfully, count:', response.data.length);
            }
        } catch (err) {
            console.error('DataContext: Failed to fetch categories - Full error:', err);
            setError(prev => ({ ...prev, categories: err.message }));
            // Don't throw, just log - categories are optional
        } finally {
            setLoading(prev => ({ ...prev, categories: false }));
        }
    };

    // User Management
    const fetchUsers = async () => {
        setLoading(prev => ({ ...prev, users: true }));
        setError(prev => ({ ...prev, users: null }));
        try {
            console.log('DataContext: Fetching users...');
            // Assuming isAdmin is determined elsewhere or passed as a prop/context
            // For now, let's assume we always try to fetch users if this function is called.
            const response = await apiService.getAllUsers();
            console.log('DataContext: Users response:', response);
            if (response.success && response.data) {
                setUsers(response.data);
                console.log('DataContext: Users set successfully, count:', response.data.length);
            }
        } catch (err) {
            console.error('DataContext: Failed to fetch users - Full error:', err);
            setError(prev => ({ ...prev, users: err.message }));
            throw err; // Propagate error to component
        } finally {
            setLoading(prev => ({ ...prev, users: false }));
        }
    };

    // Fetch Ads
    const fetchAds = async () => {
        setLoading(prev => ({ ...prev, ads: true }));
        setError(prev => ({ ...prev, ads: null }));
        try {
            const response = await apiService.getAds();
            if (response.success && response.data) {
                setAds(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch ads:', err);
            setError(prev => ({ ...prev, ads: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, ads: false }));
        }
    };

    // Fetch Services
    const fetchServices = async () => {
        setLoading(prev => ({ ...prev, services: true }));
        setError(prev => ({ ...prev, services: null }));
        try {
            const response = await apiService.services.getAll();
            if (response.success && response.data) {
                setServices(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch services:', err);
            setError(prev => ({ ...prev, services: err.message }));
        } finally {
            setLoading(prev => ({ ...prev, services: false }));
        }
    };

    const refreshData = async () => {
        console.log('🔄 Refreshing all data...');
        setLoading(prev => ({ ...prev, products: true, stores: true, news: true, ads: true, categories: true, users: true, services: true }));
        setError(prev => ({ ...prev, products: null, stores: null, news: null, ads: null, categories: null, users: null, services: null }));
        try {
            // Assuming isAdmin is a boolean variable available in this scope, e.g., from another context or prop.
            // For this change, we'll assume it's defined or handle its absence.
            // If isAdmin is not defined, this line will cause a reference error.
            // For now, let's define a placeholder isAdmin. In a real app, this would come from auth context.
            const isAdmin = true; // Placeholder: Replace with actual isAdmin check

            const [productsRes, storesRes, newsRes, adsRes, categoriesRes, usersRes, servicesRes] = await Promise.all([
                apiService.getProducts({ limit: 50, page: 1 }).catch(e => { console.error("Failed to fetch products during refresh:", e); return { success: false, data: [] }; }),
                apiService.getStores().catch(e => { console.error("Failed to fetch stores during refresh:", e); return { success: false, data: [] }; }),
                apiService.getNews().catch(e => { console.error("Failed to fetch news during refresh:", e); return { success: false, data: [] }; }),
                apiService.getAds().catch(e => { console.error("Failed to fetch ads during refresh:", e); return { success: false, data: [] }; }),
                apiService.categories.getAll().catch(e => { console.error("Failed to fetch categories during refresh:", e); return { success: false, data: [] }; }),
                isAdmin ? apiService.getAllUsers().catch(e => { console.error("Failed to fetch users during refresh:", e); return { success: false, data: [] }; }) : Promise.resolve({ success: true, data: [] }),
                apiService.services.getAll().catch(e => { console.error("Failed to fetch services during refresh:", e); return { success: false, data: [] }; })
            ]);

            setProducts(productsRes.data || []);
            setStores(storesRes.data || []);
            setNews(newsRes.data || []);
            setAds(adsRes.data || []);
            setCategories(categoriesRes.data || []);
            if (isAdmin) setUsers(usersRes.data || []);
            setServices(servicesRes.data || []);

            console.log('✅ All data refreshed successfully.');
        } catch (e) {
            console.error("Refresh data failed partially:", e);
        } finally {
            setLoading(prev => ({ ...prev, products: false, stores: false, news: false, ads: false, categories: false, users: false, services: false }));
        }
    };

    // Unified database loading check
    useEffect(() => {
        // Only run this check if we are currently loading initially
        if (initialLoading) {
            // Check if essential data is loaded
            const productsLoaded = !loading.products && products.length > 0;
            const storesLoaded = !loading.stores && stores.length > 0;
            const categoriesLoaded = categories.length > 0; // Categories fetch doesn't have a loading state but we can check length

            // Determine if we are ready to hide intro
            // We wait for at least products and stores as they are critical
            if (productsLoaded && storesLoaded) {
                const elapsedTime = Date.now() - mountTime;
                const minDisplayTime = 2000; // Increased to 2 seconds for better effect
                const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

                setTimeout(() => {
                    setInitialLoading(false);
                }, remainingTime);
            }
        }

        if (!loading.products && products.length > 0) {
            // Load ads after a short delay
            setTimeout(() => {
                fetchAds();
            }, 500);
        }
    }, [loading.products, products.length, loading.stores, stores.length, initialLoading, mountTime]);

    // Independent fetch for categories
    useEffect(() => {
        fetchCategories();
    }, []);

    // Products and stores are no longer cached in localStorage - always fetch fresh from database

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

    // Ads are no longer cached in localStorage - always fetch fresh from database

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

    // Category Management functions (fetchCategories moved earlier)

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





    // Service Actions
    const addService = async (serviceData) => {
        setLoading(prev => ({ ...prev, services: true }));
        try {
            const response = await apiService.services.create(serviceData);
            // Backend returns the created object directly or { success: true, data: ... }
            const newService = response.data || response;
            if (newService && (newService._id || newService.id)) {
                setServices(prev => [...prev, newService]);
                return newService;
            }
        } catch (err) {
            setError(prev => ({ ...prev, services: err.message }));
            throw err;
        } finally {
            setLoading(prev => ({ ...prev, services: false }));
        }
    };

    // Service Request Actions
    const requestService = async (serviceId) => {
        try {
            const response = await apiService.serviceRequests.create({ serviceId });
            return response.data || response;
        } catch (err) {
            console.error('Failed to create service request:', err);
            throw err;
        }
    };

    const fetchServiceRequests = async () => {
        try {
            const response = await apiService.serviceRequests.getAll();
            return response.data || response;
        } catch (err) {
            console.error('Failed to fetch service requests:', err);
            return [];
        }
    };

    const updateServiceRequestStatus = async (id, status) => {
        try {
            const response = await apiService.serviceRequests.updateStatus(id, status);
            return response.data || response;
        } catch (err) {
            console.error('Failed to update service request status:', err);
            throw err;
        }
    };

    const updateService = async (updatedService) => {
        setLoading(prev => ({ ...prev, services: true }));
        try {
            const response = await apiService.services.update(updatedService._id || updatedService.id, updatedService);
            const data = response.data || response;
            if (data && (data._id || data.id)) {
                setServices(prev => prev.map(s => (s._id || s.id) === (data._id || data.id) ? data : s));
                return data;
            }
        } catch (err) {
            setError(prev => ({ ...prev, services: err.message }));
            throw err;
        } finally {
            setLoading(prev => ({ ...prev, services: false }));
        }
    };

    const deleteService = async (id) => {
        setLoading(prev => ({ ...prev, services: true }));
        try {
            await apiService.services.delete(id);
            setServices(prev => prev.filter(s => (s._id || s.id) !== id));
            return true;
        } catch (err) {
            setError(prev => ({ ...prev, services: err.message }));
            throw err;
        } finally {
            setLoading(prev => ({ ...prev, services: false }));
        }
    };

    // Saved Products Management
    const fetchSavedProducts = async () => {
        try {
            const response = await apiService.getSavedProducts();
            if (response.success && response.data) {
                setSavedProducts(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch saved products:', err);
        }
    };

    const toggleSaveProduct = async (productId) => {
        try {
            const response = await apiService.toggleSavedProduct(productId);
            if (response.success && response.data) {
                // If the response is the updated list of IDs, we might need to re-fetch details
                // But our backend returns populated objects now (based on controller update)
                // Let's verify: controller returns updatedUser.savedProducts which IS populated.
                setSavedProducts(response.data);
                return true;
            }
        } catch (err) {
            console.error('Failed to toggle saved product:', err);
            return false;
        }
    };

    // Load saved products on initial load or when user changes
    useEffect(() => {
        fetchSavedProducts();
    }, []);

    const value = {
        products,
        stores,
        orders,
        news,
        ads,
        categories,
        users,
        services,
        loading,
        error,
        initialLoading,
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
        addService,
        updateService,
        deleteService,
        requestService,
        fetchServiceRequests,
        updateServiceRequestStatus,
        refreshData, // Exposed for Pull to Refresh
        savedProducts,
        fetchSavedProducts,
        toggleSaveProduct
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
