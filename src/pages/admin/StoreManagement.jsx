import { useState, useEffect } from 'react';
import {
    Store,
    Plus,
    Upload,
    Search,
    Edit2,
    Trash2,
    MapPin,
    ArrowLeft,
    Package,
    Save,
    X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useStores, useCreateStore, useUpdateStore, useDeleteStore } from '../../hooks/queries/useStores';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/queries/useProducts';
import { useCategories } from '../../hooks/queries/useCategories';
import useCloudinaryUpload from '../../hooks/useCloudinaryUpload';

const StoreManagement = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    // NEW HOOKS
    const { data: stores = [] } = useStores();
    const { data: products = [] } = useProducts();
    const { data: categories = [] } = useCategories();

    const { mutateAsync: addStore } = useCreateStore();
    const { mutateAsync: updateStore } = useUpdateStore();
    const { mutateAsync: deleteStore } = useDeleteStore();

    const { mutateAsync: addProduct } = useCreateProduct();
    const { mutateAsync: updateProduct } = useUpdateProduct();
    const { mutateAsync: deleteProduct } = useDeleteProduct();

    const { uploadImage, uploading: uploadingImage } = useCloudinaryUpload();

    const isStoreAdmin = user?.role === 'store_admin';
    const myStore = isStoreAdmin ? stores.find(s => s._id === user.storeId || s.id === user.storeId) : null;

    const [view, setView] = useState('list'); // Default to list view for everyone
    const [selectedStore, setSelectedStore] = useState(myStore);
    const [editingStore, setEditingStore] = useState(myStore);

    // Initial load for Store Admin
    useEffect(() => {
        if (isStoreAdmin && myStore && !editingStore) {
            // We can pre-set these for convenience, but we DON'T change the view to 'form'
            setEditingStore(myStore);
            setSelectedStore(myStore);
            setStoreForm({
                name: myStore.name,
                address: myStore.address || '',
                image: myStore.image,
                rating: myStore.rating,
                openingTime: myStore.openingTime || '09:00',
                closingTime: myStore.closingTime || '21:00',
                mobile: myStore.mobile || '',
                category: myStore.type || ''
            });
        }
    }, [isStoreAdmin, myStore, stores, editingStore]);

    // Add back button logic for Store Admin? Maybe not needed if we force view.
    const handleBackToList = () => {
        if (isStoreAdmin) return; // Store admin doesn't go back to list
        setView('list');
    };
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [storeForm, setStoreForm] = useState({
        name: '',
        address: '',
        image: '',
        rating: 4.5,
        openingTime: '09:00',
        closingTime: '21:00',
        mobile: '',
        category: ''
    });
    const [productForm, setProductForm] = useState({
        title: '',
        price: '',
        category: '',
        description: '',
        image: '',
        sliderImages: [],
        stock: 0,
        unit: 'kg'
    });

    const handleStoreImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const imageUrl = await uploadImage(file);
                setStoreForm({ ...storeForm, image: imageUrl });
            } catch (error) {
                console.error('Store image upload failed:', error);
                alert(t('Failed to upload image. Please try again.'));
            }
        }
    };

    const handleProductImageUpload = async (e, isSlider = false) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            try {
                if (isSlider) {
                    // Upload all slider images
                    const promises = files.map(file => uploadImage(file));
                    const urls = await Promise.all(promises);
                    setProductForm(prev => ({ ...prev, sliderImages: [...prev.sliderImages, ...urls] }));
                } else {
                    // Single image upload
                    const imageUrl = await uploadImage(files[0]);
                    setProductForm(prev => ({ ...prev, image: imageUrl }));
                }
            } catch (error) {
                console.error('Product image upload failed:', error);
                alert(t('Failed to upload image. Please try again.'));
            }
        }
    };

    const removeSliderImage = (index) => {
        setProductForm(prev => ({
            ...prev,
            sliderImages: prev.sliderImages.filter((_, i) => i !== index)
        }));
    };

    const handleEditStore = (store) => {
        setEditingStore(store);
        setStoreForm({
            name: store.name,
            address: store.address || '',
            image: store.image,
            rating: store.rating,
            openingTime: store.openingTime || '09:00',
            closingTime: store.closingTime || '21:00',
            mobile: store.mobile || '',
            category: store.type || ''
        });
        setView('form');
    };

    const handleDeleteStore = async (id) => {
        if (window.confirm(t('Are you sure you want to delete this store?'))) {
            try {
                await deleteStore(id);
                alert(t('Store deleted successfully!'));
            } catch (error) {
                console.error('Error deleting store:', error);
                alert(t('Failed to delete store. Please try again.'));
            }
        }
    };

    const handleStoreSubmit = async (e) => {
        e.preventDefault();

        // Generate timing string from time fields for backward compatibility
        const formatTime = (time24) => {
            const [hours, minutes] = time24.split(':');
            const hour = parseInt(hours);
            const period = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            return `${hour12}:${minutes} ${period}`;
        };

        const timingString = `${formatTime(storeForm.openingTime)} - ${formatTime(storeForm.closingTime)}`;

        const storeData = {
            name: storeForm.name,
            type: storeForm.category || 'General Store', // Use selected category as type
            address: storeForm.address,
            city: storeForm.address.split(',').pop().trim() || 'Unknown', // Extract city from address
            timing: timingString,
            openingTime: storeForm.openingTime,
            closingTime: storeForm.closingTime,
            mobile: storeForm.mobile,
            image: storeForm.image,
            rating: storeForm.rating || 4.5
        };

        try {
            if (editingStore) {
                await updateStore({ id: editingStore._id || editingStore.id, data: storeData });
                alert(t('Store updated successfully!'));
            } else {
                await addStore(storeData);
                alert(t('Store added successfully!'));
            }
            setStoreForm({ name: '', address: '', image: '', rating: 4.5, openingTime: '09:00', closingTime: '21:00', mobile: '', category: '' });
            setEditingStore(null);
            setView('list');
        } catch (error) {
            alert(t('Failed to save store. Please try again.'));
            console.error('Error saving store:', error);
        }
    };

    const handleManageProducts = (store) => {
        setSelectedStore(store);
        setView('storeProducts');
    };

    const proceedToManageProducts = (store) => {
        setSelectedStore(store);
        setView('storeProducts');
    };

    const handleAddProductToStore = () => {
        setProductForm({ title: '', price: '', category: '', description: '', image: '', sliderImages: [], stock: 0, unit: 'kg' });
        setEditingProduct(null);
        setView('addProductToStore');
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            title: product.title,
            price: product.price,
            category: product.category,
            description: product.description,
            image: product.image,
            sliderImages: product.images || [],
            stock: product.stock || 0,
            unit: product.unit || 'kg'
        });
        setView('addProductToStore'); // Reusing the add form for editing
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm(t('Are you sure you want to delete this product?'))) {
            try {
                await deleteProduct(productId);
                alert(t('Product deleted successfully!'));
            } catch (error) {
                console.error('Error deleting product:', error);
                alert(t('Failed to delete product. Please try again.'));
            }
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStore) {
            alert(t('No store selected. Please go back and select a store.'));
            return;
        }

        const productData = {
            ...productForm,
            price: parseFloat(productForm.price),
            storeId: selectedStore._id || selectedStore.id,
            images: productForm.sliderImages.length > 0 ? productForm.sliderImages : [productForm.image] // Use slider images if available, else main image
        };

        try {
            if (editingProduct) {
                await updateProduct({ id: editingProduct._id || editingProduct.id, data: productData });
                alert(t('Product updated successfully!'));
            } else {
                await addProduct(productData);
                alert(t('Product added to store successfully!'));
            }
            setView('storeProducts');
        } catch (error) {
            console.error('Error saving product:', error);
            const errorMessage = error.response?.data?.message || error.message || t('Failed to save product. Please try again.');
            alert(`${t('Error')}: ${errorMessage}`);
        }
    };

    // Determine stores to display
    const displayedStores = isStoreAdmin
        ? (myStore ? [myStore] : [])
        : stores.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.address && s.address.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    return (
        <div className="max-w-6xl">
            {/* Header */}
            {!isStoreAdmin && view === 'list' && (
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Manage Stores')}</h2>
                    <button
                        onClick={() => {
                            setEditingStore(null);
                            setStoreForm({ name: '', address: '', image: '', rating: 4.5, openingTime: '09:00', closingTime: '21:00', mobile: '', category: '' });
                            setView('form');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        {t('Add New Store')}
                    </button>
                </div>
            )}

            {view === 'list' && (
                <>
                    {/* Search Bar - Hide for Store Admin */}
                    {!isStoreAdmin && (
                        <div className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t('Search by store name or location...')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedStores.map(store => (
                            <div key={store.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
                                <div className="h-48 overflow-hidden relative">
                                    {store.image ? (
                                        <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
                                    )}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        {/* Allow edit for store admin too */}
                                        <button
                                            onClick={() => handleEditStore(store)}
                                            className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-blue-600 hover:text-blue-700 shadow-sm"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        {/* Hide delete for store admin? User didn't specify, but usually safer */}
                                        {!isStoreAdmin && (
                                            <button
                                                onClick={() => handleDeleteStore(store.id || store._id)}
                                                className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-red-600 hover:text-red-700 shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{store.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex items-center gap-2">
                                        <MapPin size={16} />
                                        {store.address || 'No address'}
                                    </p>
                                    <button
                                        onClick={() => handleManageProducts(store)}
                                        className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                                    >
                                        {t('Manage Products')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {view === 'form' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            {!isStoreAdmin && (
                                <button
                                    onClick={handleBackToList}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            )}
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingStore ? (isStoreAdmin ? t('My Store Settings') : t('Edit Store')) : t('Add New Store')}
                            </h2>
                        </div>
                        {isStoreAdmin && editingStore && (
                            <button
                                onClick={() => proceedToManageProducts(editingStore)}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                            >
                                <Package size={18} />
                                {t('Manage Products')}
                            </button>
                        )}
                    </div>
                    <form onSubmit={handleStoreSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Store Name')}</label>
                                <input
                                    type="text"
                                    value={storeForm.name}
                                    onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Address')}</label>
                                <input
                                    type="text"
                                    value={storeForm.address}
                                    onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., 123 Main St, City"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Opening Time')}</label>
                                <input
                                    type="time"
                                    value={storeForm.openingTime}
                                    onChange={(e) => setStoreForm({ ...storeForm, openingTime: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Closing Time')}</label>
                                <input
                                    type="time"
                                    value={storeForm.closingTime}
                                    onChange={(e) => setStoreForm({ ...storeForm, closingTime: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Mobile Number')}</label>
                                <input
                                    type="tel"
                                    value={storeForm.mobile}
                                    onChange={(e) => setStoreForm({ ...storeForm, mobile: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder={t('Enter mobile number')}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Category')}</label>
                                <select
                                    value={storeForm.category}
                                    onChange={(e) => setStoreForm({ ...storeForm, category: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="">{t('Select Category')}</option>
                                    {categories && categories.length > 0 && categories.map((cat) => (
                                        <option key={cat._id || cat.id} value={cat.name}>
                                            {t(cat.name)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Store Image')}</label>
                                <div className="flex items-center gap-4">
                                    {storeForm.image && (
                                        <img src={storeForm.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                            <Upload size={20} />
                                            <span>{uploadingImage ? t('Uploading...') : t('Upload Image')}</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleStoreImageUpload} className="hidden" required={!storeForm.image} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={uploadingImage}
                                className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${uploadingImage
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {uploadingImage ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>{t('Uploading...')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        {editingStore ? t('Update Store') : t('Add Store')}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {view === 'storeProducts' && selectedStore && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    setView('list');
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{selectedStore.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('Manage Products')}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAddProductToStore}
                            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={20} />
                            {t('Add Product')}
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Image')}</th>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Title')}</th>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Price')}</th>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {products.filter(p => {
                                        const pStoreId = p.storeId?._id || p.storeId;
                                        const targetId = selectedStore._id || selectedStore.id;
                                        return pStoreId == targetId || String(pStoreId) === String(targetId);
                                    }).map(product => (
                                        <tr key={product._id || product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="p-4">
                                                <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                                            </td>
                                            <td className="p-4 font-medium text-gray-900 dark:text-white">{product.title}</td>
                                            <td className="p-4 font-medium text-gray-900 dark:text-white">${product.price}</td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product._id || product.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.filter(p => {
                                        const pStoreId = p.storeId?._id || p.storeId;
                                        const targetId = selectedStore._id || selectedStore.id;
                                        return pStoreId == targetId || String(pStoreId) === String(targetId);
                                    }).length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">
                                                    {t('No products found in this store. Add one to get started!')}
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {view === 'addProductToStore' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => setView('storeProducts')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                            {editingProduct ? t('Edit Product') : `${t('Add Product to')} ${selectedStore?.name}`}
                        </h2>
                    </div>
                    <form onSubmit={handleProductSubmit} className="space-y-6">
                        {/* Product Form Fields - Similar to ProductManagement but with slider images */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Product Title')}</label>
                                <input
                                    type="text"
                                    value={productForm.title}
                                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    value={productForm.price}
                                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Category')}</label>
                                <select
                                    value={productForm.category}
                                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="">{t('Select Category')}</option>
                                    {categories && categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <option key={cat._id || cat.id} value={cat.name}>
                                                {t(cat.name)}
                                            </option>
                                        ))
                                    ) : (
                                        <>
                                            <option value="Electronics">{t('Electronics')}</option>
                                            <option value="Fashion">{t('Fashion')}</option>
                                            <option value="Home">{t('Home')}</option>
                                            <option value="Beauty">{t('Beauty')}</option>
                                        </>
                                    )}
                                </select>
                            </div>



                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Main Image')}</label>
                                <div className="flex items-center gap-4">
                                    {productForm.image && (
                                        <img src={productForm.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                            <Upload size={20} />
                                            <span>{uploadingImage ? t('Uploading...') : t('Upload Image')}</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={(e) => handleProductImageUpload(e, false)} className="hidden" required={!productForm.image} />
                                    </label>
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Slider Images (Optional)')}</label>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-4">
                                        {productForm.sliderImages.map((img, idx) => (
                                            <div key={idx} className="relative w-20 h-20 group">
                                                <img src={img} alt={`Slider ${idx}`} className="w-full h-full rounded-lg object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSliderImage(idx)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="cursor-pointer">
                                            <div className="w-20 h-20 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center">
                                                <Plus size={24} />
                                            </div>
                                            <input type="file" accept="image/*" multiple onChange={(e) => handleProductImageUpload(e, true)} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Description')}</label>
                            <textarea
                                value={productForm.description}
                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={uploadingImage}
                                className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${uploadingImage
                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {uploadingImage ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>{t('Uploading...')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        {editingProduct ? t('Update Product') : t('Add Product to Store')}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StoreManagement;
