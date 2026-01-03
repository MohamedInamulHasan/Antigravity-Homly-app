import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    Store,
    Newspaper,
    ShoppingBag,
    Users,
    Plus,
    Upload,
    Search,
    CheckCircle,
    XCircle,
    ChevronRight,
    MapPin,
    Phone,
    Mail,
    ArrowLeft,
    List,
    Menu,
    X,
    Edit2,
    Save,

    Trash2,
    Image as ImageIcon,
    RefreshCw,
    Wrench
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { compressImage, validateImageSize } from '../../utils/imageCompression';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useLanguage();

    const renderContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductManagement />;
            case 'stores':
                return <StoreManagement />;
            case 'news':
                return <NewsManagement />;
            case 'orders':
                return <OrderManagement />;
            case 'users':
                return <UserManagement />;
            case 'categories':
                return <CategoryManagement />;
            case 'ads':
                return <AdsManagement />;
            case 'services':
                return <ServiceManagement />;
            default:
                return <ProductManagement />;
        }
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200 relative">
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-600 dark:text-gray-300"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex flex-col
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <LayoutDashboard className="text-blue-600 dark:text-blue-400" />
                        {t('Admin Panel')}
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarItem
                        icon={<Package size={20} />}
                        label={t('Products')}
                        active={activeTab === 'products'}
                        onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<Store size={20} />}
                        label={t('Stores')}
                        active={activeTab === 'stores'}
                        onClick={() => { setActiveTab('stores'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<Newspaper size={20} />}
                        label={t('News & Offers')}
                        active={activeTab === 'news'}
                        onClick={() => { setActiveTab('news'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<ShoppingBag size={20} />}
                        label={t('Orders')}
                        active={activeTab === 'orders'}
                        onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<Users size={20} />}
                        label={t('Users')}
                        active={activeTab === 'users'}
                        onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<List size={20} />}
                        label={t('Categories')}
                        active={activeTab === 'categories'}
                        onClick={() => { setActiveTab('categories'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<ImageIcon size={20} />}
                        label={t('Ads Slider')}
                        active={activeTab === 'ads'}
                        onClick={() => { setActiveTab('ads'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<Wrench size={20} />}
                        label={t('Services')}
                        active={activeTab === 'services'}
                        onClick={() => { setActiveTab('services'); setIsMobileMenuOpen(false); }}
                    />
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto w-full">
                <div className="p-4 md:p-8 pt-16 md:pt-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${active
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
    >
        {icon}
        {label}
    </button>
);

// --- Sub-Components ---

const ProductManagement = () => {
    const { products, stores, categories, addProduct, updateProduct, deleteProduct } = useData();
    const { t } = useLanguage();
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: '',
        storeId: '',
        description: '',
        image: '',
        sliderImages: []
    });

    const handleImageUpload = (e, isSlider = false) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (isSlider) {
                        setFormData(prev => ({ ...prev, sliderImages: [...prev.sliderImages, reader.result] }));
                    } else {
                        setFormData(prev => ({ ...prev, image: reader.result }));
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeSliderImage = (index) => {
        setFormData(prev => ({
            ...prev,
            sliderImages: prev.sliderImages.filter((_, i) => i !== index)
        }));
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title,
            price: product.price,
            category: product.category,
            storeId: product.storeId || '',
            description: product.description,
            image: product.image || (product.images && product.images[0]) || '',
            sliderImages: product.images || [],
            stock: product.stock || 0,
            unit: product.unit || 'kg'
        });
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('Are you sure you want to delete this product?'))) {
            try {
                await deleteProduct(id);
                alert(t('Product deleted successfully!'));
            } catch (error) {
                alert(t('Failed to delete product. Please try again.'));
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the images array
        const imagesArray = formData.sliderImages.length > 0
            ? formData.sliderImages
            : (formData.image ? [formData.image] : []);

        const productData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            price: parseFloat(formData.price),
            image: formData.image || imagesArray[0], // Main image (required)
            images: imagesArray, // Array of images (optional)
            stock: parseInt(formData.stock) || 0,
            unit: formData.unit || 'kg'
        };

        // Add storeId only if it's not empty
        if (formData.storeId) {
            productData.storeId = formData.storeId;
        }

        try {
            if (editingProduct) {
                await updateProduct({ ...editingProduct, ...productData });
                alert(t('Product updated successfully!'));
            } else {
                await addProduct(productData);
                alert(t('Product uploaded successfully!'));
            }
            setFormData({ title: '', price: '', category: '', storeId: '', description: '', image: '', sliderImages: [], stock: 0, unit: 'kg' });
            setEditingProduct(null);
            setView('list');
        } catch (error) {
            alert(t('Failed to save product. Please try again.'));
            console.error('Error saving product:', error);
        }
    };

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {view === 'list' ? t('Product Inventory') : editingProduct ? t('Edit Product') : t('Add New Product')}
                </h2>
                <button
                    onClick={() => {
                        if (view === 'list') {
                            setEditingProduct(null);
                            setFormData({ title: '', price: '', category: '', storeId: '', description: '', image: '', sliderImages: [], stock: 0, unit: 'kg' });
                            setView('form');
                        } else {
                            setView('list');
                        }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    {view === 'list' ? <Plus size={20} /> : <List size={20} />}
                    {view === 'list' ? t('Add Product') : t('View List')}
                </button>
            </div>

            {view === 'list' ? (
                <>
                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('Search products...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Image')}</th>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Title')}</th>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Category')}</th>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Price')}</th>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {products
                                        .filter(p => !p.storeId)
                                        .filter(p =>
                                            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
                                        )
                                        .map(product => (
                                            <tr key={product.id || product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="p-4">
                                                    <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                                                </td>
                                                <td className="p-4 font-medium text-gray-900 dark:text-white">{product.title}</td>
                                                <td className="p-4 text-gray-500 dark:text-gray-400">{product.category}</td>
                                                <td className="p-4 font-medium text-gray-900 dark:text-white">${product.price}</td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id || product._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Product Title')}</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder={t('e.g., Wireless Headphones')}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Price')}</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Category')}</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Store')}</label>
                                <select
                                    value={formData.storeId}
                                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">{t('Select Store (Optional)')}</option>
                                    {stores.map(store => (
                                        <option key={store.id || store._id} value={store.id || store._id}>
                                            {t(store, 'name')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Main Image')}</label>
                                <div className="flex items-center gap-4">
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                            <Upload size={20} />
                                            <span>{t('Upload Image')}</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, false)}
                                            className="hidden"
                                            required={!formData.image}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Slider Images (Optional)')}</label>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-4">
                                        {formData.sliderImages.map((img, idx) => (
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
                                            <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Description')}</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder={t('Product description...')}
                                required
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                {editingProduct ? <Save size={20} /> : <Plus size={20} />}
                                {editingProduct ? t('Update Product') : t('Add Product')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const StoreManagement = () => {
    const { stores, products, categories, addStore, updateStore, addProduct, updateProduct, deleteProduct, deleteStore } = useData();
    const { t } = useLanguage();
    const [view, setView] = useState('list'); // 'list', 'form', 'storeProducts', 'addProductToStore', 'editProduct'
    const [selectedStore, setSelectedStore] = useState(null);
    const [editingStore, setEditingStore] = useState(null);
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

    const handleStoreImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setStoreForm({ ...storeForm, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProductImageUpload = (e, isSlider = false) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (isSlider) {
                        setProductForm(prev => ({ ...prev, sliderImages: [...prev.sliderImages, reader.result] }));
                    } else {
                        setProductForm(prev => ({ ...prev, image: reader.result }));
                    }
                };
                reader.readAsDataURL(file);
            });
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
                await updateStore({ ...editingStore, ...storeData });
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
            stock: parseInt(productForm.stock) || 0,
            unit: productForm.unit || 'kg',
            storeId: selectedStore._id || selectedStore.id,
            images: productForm.sliderImages.length > 0 ? productForm.sliderImages : [productForm.image] // Use slider images if available, else main image
        };

        try {
            if (editingProduct) {
                await updateProduct({ ...editingProduct, ...productData });
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

    return (
        <div className="max-w-6xl">
            {view === 'list' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t('Store Management')}</h2>
                        <button
                            onClick={() => setView('form')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={20} />
                            {t('Add Store')}
                        </button>
                    </div>

                    {/* Search Bar */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores
                            .filter(s =>
                                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (s.address && s.address.toLowerCase().includes(searchQuery.toLowerCase()))
                            )
                            .map(store => (
                                <div key={store.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <button
                                                onClick={() => handleEditStore(store)}
                                                className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-blue-600 hover:text-blue-700 shadow-sm"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStore(store.id || store._id)}
                                                className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-red-600 hover:text-red-700 shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
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
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{editingStore ? t('Edit Store') : t('Add New Store')}</h2>
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
                                            <span>{t('Upload Image')}</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleStoreImageUpload} className="hidden" required={!storeForm.image} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Save size={20} />
                                {editingStore ? t('Update Store') : t('Add Store')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {view === 'storeProducts' && selectedStore && (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{selectedStore.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('Manage Products')}</p>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Stock')}</label>
                                <input
                                    type="number"
                                    value={productForm.stock}
                                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Unit')}</label>
                                <select
                                    value={productForm.unit}
                                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="kg">{t('Kilogram (kg)')}</option>
                                    <option value="g">{t('Gram (g)')}</option>
                                    <option value="l">{t('Liter (l)')}</option>
                                    <option value="ml">{t('Milliliter (ml)')}</option>
                                    <option value="pcs">{t('Pieces (pcs)')}</option>
                                    <option value="box">{t('Box')}</option>
                                    <option value="pack">{t('Pack')}</option>
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
                                            <span>{t('Upload Image')}</span>
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
                            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Plus size={20} />
                                {editingProduct ? t('Update Product') : t('Add Product to Store')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const NewsManagement = () => {
    const { news, addNews, updateNews, deleteNews } = useData();
    const { t } = useLanguage();
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [editingNews, setEditingNews] = useState(null);
    const [newsForm, setNewsForm] = useState({
        headline: '',
        type: 'Offer',
        image: '',
        content: '',
    });

    const handleNewsImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setNewsForm({ ...newsForm, image: imageUrl });
        }
    };

    const handleEditNews = (item) => {
        setEditingNews(item);
        setNewsForm({
            headline: item.title, // Map title to headline
            type: item.category, // Map category to type
            image: item.image,
            content: item.content || item.description, // Map content to content form field
        });
        setView('form');
    };

    const handleDeleteNews = async (id) => {
        if (window.confirm(t('Are you sure you want to delete this post?'))) {
            try {
                await deleteNews(id);
                alert(t('Post deleted successfully!'));
            } catch (error) {
                console.error('Error deleting news:', error);
                alert(t('Failed to delete post. Please try again.'));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newsItem = {
            title: newsForm.headline,
            category: newsForm.type,
            image: newsForm.image,
            content: newsForm.content,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        if (editingNews) {
            updateNews({ ...editingNews, ...newsItem });
            alert(t('News updated successfully!'));
        } else {
            addNews(newsItem);
            alert(t('News published successfully!'));
        }
        setNewsForm({ headline: '', type: 'Offer', image: '', content: '' });
        setEditingNews(null);
        setView('list');
    };

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {view === 'list' ? t('News & Offers') : editingNews ? t('Edit Post') : t('Publish News & Offers')}
                </h2>
                <button
                    onClick={() => {
                        if (view === 'list') {
                            setEditingNews(null);
                            setNewsForm({ headline: '', type: 'Offer', image: '', content: '' });
                            setView('form');
                        } else {
                            setView('list');
                        }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    {view === 'list' ? <Plus size={20} /> : <List size={20} />}
                    {view === 'list' ? t('Add Post') : t('View List')}
                </button>
            </div>

            {view === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {news.map(item => (
                        <div key={item._id || item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group relative">
                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEditNews(item); }}
                                    className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-blue-600 hover:text-blue-700 shadow-sm"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteNews(item._id || item.id); }}
                                    className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-red-600 hover:text-red-700 shadow-sm"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="h-48 overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.category === 'Offer' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                        {item.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
                                    {item.content || item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Headline')}</label>
                            <input
                                type="text"
                                value={newsForm.headline}
                                onChange={(e) => setNewsForm({ ...newsForm, headline: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Type')}</label>
                                <select
                                    value={newsForm.type}
                                    onChange={(e) => setNewsForm({ ...newsForm, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option>{t('Offer')}</option>
                                    <option>{t('News')}</option>
                                    <option>{t('Deal')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Post Image')}</label>
                                <div className="flex items-center gap-4">
                                    {newsForm.image && (
                                        <img src={newsForm.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                            <Upload size={20} />
                                            <span>{t('Upload Image')}</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleNewsImageUpload}
                                            className="hidden"
                                            required={!newsForm.image}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Content')}</label>
                            <textarea
                                rows="5"
                                value={newsForm.content}
                                onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                {editingNews ? <Save size={20} /> : <Newspaper size={20} />}
                                {editingNews ? t('Update Post') : t('Publish')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const OrderManagement = () => {
    const { orders, updateOrder, deleteOrder, refreshOrders } = useData();
    const { t } = useLanguage();
    const [editingOrder, setEditingOrder] = useState(null);
    const [editAddress, setEditAddress] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Real-time updates: Poll every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshOrders();
        }, 10000);
        return () => clearInterval(interval);
    }, [refreshOrders]);

    const handleManualRefresh = async () => {
        setIsRefreshing(true);
        await refreshOrders();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const updateStatus = (id, newStatus) => {
        const order = orders.find(o => (o._id || o.id) === id);
        if (order) {
            updateOrder({ ...order, status: newStatus });
        }
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order._id || order.id);
        setEditAddress(order.shippingAddress?.street + ', ' + order.shippingAddress?.city || '');
    };

    const saveOrder = (id) => {
        const order = orders.find(o => (o._id || o.id) === id);
        if (order) {
            updateOrder({ ...order, address: editAddress });
            setEditingOrder(null);
        }
    };

    const handleDeleteOrder = async (id) => {
        if (window.confirm(t('Are you sure you want to delete this order?'))) {
            try {
                await deleteOrder(id);
                alert(t('Order deleted successfully!'));
            } catch (error) {
                console.error('Error deleting order:', error);
                alert(t('Failed to delete order'));
            }
        }
    };

    // Group orders by status
    const processingOrders = orders.filter(o => o.status === 'Processing');
    const shippedOrders = orders.filter(o => o.status === 'Shipped');
    const deliveredOrders = orders.filter(o => o.status === 'Delivered');
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled');

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' at ' +
            date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const renderOrderTable = (ordersList, statusLabel, statusColor) => {
        if (ordersList.length === 0) return null;

        return (
            <div key={statusLabel} className="mb-8">
                <h3 className={`text-lg font-semibold mb-4 ${statusColor}`}>
                    {t(statusLabel)} ({ordersList.length})
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Order ID')}</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Customer')}</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Mobile')}</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Address')}</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Date & Time')}</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Total')}</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Status')}</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {ordersList.map(order => (
                                    <tr key={order._id || order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4 font-medium text-gray-900 dark:text-white">#{String(order._id || order.id).slice(-6).toUpperCase()}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{order.shippingAddress?.name || order.user}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{order.shippingAddress?.mobile || 'N/A'}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                                            {editingOrder === (order._id || order.id) ? (
                                                <input
                                                    type="text"
                                                    value={editAddress}
                                                    onChange={(e) => setEditAddress(e.target.value)}
                                                    className="w-full px-2 py-1 border rounded"
                                                />
                                            ) : (
                                                <span className="truncate block" title={`${order.shippingAddress?.street}, ${order.shippingAddress?.city}`}>
                                                    {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}` : 'N/A'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                                            {formatDateTime(order.createdAt || order.date)}
                                        </td>
                                        <td className="p-4 font-medium text-gray-900 dark:text-white">₹{order.total.toFixed(0)}</td>
                                        <td className="p-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id || order.id, e.target.value)}
                                                className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {/* Current status is always shown */}
                                                <option value={order.status}>{t(order.status)}</option>

                                                {/* Show valid next statuses based on current status */}
                                                {order.status === 'Processing' && (
                                                    <>
                                                        <option value="Shipped">{t('Shipped')}</option>
                                                        <option value="Cancelled">{t('Cancelled')}</option>
                                                    </>
                                                )}
                                                {order.status === 'Shipped' && (
                                                    <>
                                                        <option value="Delivered">{t('Delivered')}</option>
                                                        <option value="Cancelled">{t('Cancelled')}</option>
                                                    </>
                                                )}
                                                {/* Delivered and Cancelled are final states - no changes allowed */}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            {editingOrder === (order._id || order.id) ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => saveOrder(order._id || order.id)} className="text-green-600 hover:text-green-700"><CheckCircle size={18} /></button>
                                                    <button onClick={() => setEditingOrder(null)} className="text-red-600 hover:text-red-700"><XCircle size={18} /></button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditOrder(order)} className="text-blue-600 hover:text-blue-700">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleDeleteOrder(order._id || order.id)} className="text-red-600 hover:text-red-700">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Manage Orders')}</h2>
                <button
                    onClick={handleManualRefresh}
                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600 dark:text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`}
                    title={t('Refresh Orders')}
                >
                    <RefreshCw size={24} />
                </button>
            </div>

            {/* Render orders grouped by status */}
            {renderOrderTable(processingOrders, 'Processing Orders', 'text-amber-700 dark:text-amber-400')}
            {renderOrderTable(shippedOrders, 'Shipped Orders', 'text-blue-700 dark:text-blue-400')}
            {renderOrderTable(deliveredOrders, 'Delivered Orders', 'text-green-700 dark:text-green-400')}
            {renderOrderTable(cancelledOrders, 'Cancelled Orders', 'text-red-700 dark:text-red-400')}

            {orders.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">{t('No orders found')}</p>
                </div>
            )}
        </div>
    );
};

const CategoryManagement = () => {
    const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useData();
    const { t } = useLanguage();
    const [view, setView] = useState('list');
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (!validateImageSize(file, 5)) {
                alert(t('Image is too large! Please select an image smaller than 5MB.'));
                return;
            }

            try {
                // Compress image to max 500KB and 800px width
                const compressedImage = await compressImage(file, 500, 800);
                setFormData(prev => ({ ...prev, image: compressedImage }));
            } catch (error) {
                console.error('Error compressing image:', error);
                alert(t('Failed to process image. Please try another image.'));
            }
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            image: category.image || ''
        });
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('Are you sure you want to delete this category?'))) {
            try {
                await deleteCategory(id);
                alert(t('Category deleted successfully!'));
            } catch (error) {
                alert(t('Failed to delete category. Please try again.'));
                console.error('Error deleting category:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                await updateCategory({ ...editingCategory, ...formData });
                alert(t('Category updated successfully!'));
            } else {
                console.log('Adding category with data:', formData);
                const result = await addCategory(formData);
                console.log('Category add result:', result);
                alert(t('Category added successfully!'));
            }
            setFormData({ name: '', image: '' });
            setEditingCategory(null);
            setView('list');
            fetchCategories();
        } catch (error) {
            console.error('Error saving category - Full details:', error);

            // Display specific error message from backend
            const errorMessage = error?.message || error?.data?.message || 'Failed to save category. Please try again.';
            alert(t(errorMessage));
        }
    };

    return (
        <div className="max-w-5xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {view === 'list' ? t('Categories') : editingCategory ? t('Edit Category') : t('Add New Category')}
                </h2>
                <button
                    onClick={() => {
                        if (view === 'list') {
                            setEditingCategory(null);
                            setFormData({ name: '' });
                            setView('form');
                        } else {
                            setView('list');
                        }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    {view === 'list' ? <Plus size={20} /> : <List size={20} />}
                    {view === 'list' ? t('Add Category') : t('View List')}
                </button>
            </div>

            {view === 'list' ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Name')}</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{t('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {categories.length > 0 ? categories.map(category => (
                                    <tr key={category._id || category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4 font-medium text-gray-900 dark:text-white">{category.name}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDelete(category._id || category.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="p-8 text-center text-gray-500 dark:text-gray-400">
                                            {t('No categories found. Add one to get started!')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Category Name')}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder={t('e.g., Vegetables')}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Category Image')}</label>
                            <div className="flex items-center gap-4">
                                {formData.image && (
                                    <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-gray-200 dark:ring-gray-700">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <label className="flex-1 cursor-pointer">
                                    <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                        <Upload size={20} />
                                        <span>{t('Upload Image')}</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        required={!formData.image}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                {editingCategory ? <Save size={20} /> : <Plus size={20} />}
                                {editingCategory ? t('Update Category') : t('Add Category')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const UserManagement = () => {
    const { users, fetchUsers, updateUser, deleteUser } = useData();
    const { t } = useLanguage();
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        address: ''
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching users...');
                await fetchUsers();
                console.log('Users fetched successfully, count:', users.length);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError(err?.message || 'Failed to load users');
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            mobile: user.mobile || '',
            address: user.address || ''
        });
    };

    const handleSave = async () => {
        try {
            console.log('Updating user:', { ...editingUser, ...formData });
            await updateUser({ ...editingUser, ...formData });
            alert(t('User updated successfully!'));
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user - Full details:', error);
            const errorMessage = error?.message || error?.data?.message || 'Failed to update user. Please try again.';
            alert(t(errorMessage));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('Are you sure you want to delete this user?'))) {
            try {
                console.log('Deleting user with ID:', id);
                await deleteUser(id);
                alert(t('User deleted successfully!'));
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user - Full details:', error);
                const errorMessage = error?.message || error?.data?.message || 'Failed to delete user. Please try again.';
                alert(t(errorMessage));
            }
        }
    };

    return (
        <div className="max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('User Database')}</h2>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={t('Search users by name or email...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            {loading && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">{t('Loading users...')}</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 p-6 mb-6">
                    <p className="text-red-600 dark:text-red-400">{t('Error')}: {error}</p>
                    <button
                        onClick={() => fetchUsers()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        {t('Retry')}
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="grid gap-6">
                    {users.filter(user => {
                        const query = searchQuery.toLowerCase();
                        return user.name?.toLowerCase().includes(query) ||
                            user.email?.toLowerCase().includes(query);
                    }).length > 0 ? users.filter(user => {
                        const query = searchQuery.toLowerCase();
                        return user.name?.toLowerCase().includes(query) ||
                            user.email?.toLowerCase().includes(query);
                    }).map(user => (
                        <div key={user._id || user.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            {editingUser && (editingUser._id || editingUser.id) === (user._id || user.id) ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Name')}</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Email')}</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Mobile')}</label>
                                            <input
                                                type="tel"
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Address')}</label>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => setEditingUser(null)}
                                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            {t('Cancel')}
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            <Save size={18} />
                                            {t('Save')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                <Mail size={14} />
                                                {user.email}
                                            </div>
                                            {user.mobile && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    <Phone size={14} />
                                                    {user.mobile}
                                                </div>
                                            )}
                                            {user.address && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    <MapPin size={14} />
                                                    {typeof user.address === 'string'
                                                        ? user.address
                                                        : `${user.address.street || ''}, ${user.address.city || ''}, ${user.address.state || ''}`.replace(/, ,/g, ',').replace(/^, |, $/g, '')}
                                                </div>
                                            )}
                                            <div className="mt-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                    {user.role || 'user'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id || user.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">{t('No users found.')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const AdsManagement = () => {
    const { ads, addAd, deleteAd } = useData();
    const { t } = useLanguage();
    const [newAdUrl, setNewAdUrl] = useState('');
    const [newAdTitle, setNewAdTitle] = useState('');

    const handleAdImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAdUrl(reader.result); // Base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddAd = (e) => {
        e.preventDefault();
        if (newAdUrl) {
            addAd({ image: newAdUrl, title: newAdTitle || 'Ad' });
            setNewAdUrl('');
            setNewAdTitle('');
        }
    };

    const handleDeleteAd = async (id) => {
        if (window.confirm(t('Are you sure you want to delete this ad?'))) {
            try {
                await deleteAd(id);
                alert(t('Ad deleted successfully!'));
            } catch (error) {
                console.error('Error deleting ad:', error);
                alert(t('Failed to delete ad. Please try again.'));
            }
        }
    };

    return (
        <div className="max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('Ads Slider Management')}</h2>

            {/* Add New Ad Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('Add New Ad Image')}</h3>
                <form onSubmit={handleAddAd} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Ad Image')}</label>
                        <div className="flex items-center gap-4">
                            {newAdUrl && (
                                <img src={newAdUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                            )}
                            <label className="flex-1 cursor-pointer">
                                <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                    <Upload size={20} />
                                    <span>{t('Upload Image')}</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAdImageUpload}
                                    className="hidden"
                                    required={!newAdUrl}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Title (Optional)')}</label>
                        <input
                            type="text"
                            value={newAdTitle}
                            onChange={(e) => setNewAdTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder={t('Ad Title')}
                        />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 h-[42px]">
                        <Plus size={20} /> {t('Add')}
                    </button>
                </form>
            </div>

            {/* Ads List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map(ad => (
                    <div key={ad._id || ad.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group relative">
                        <div className="aspect-video relative">
                            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleDeleteAd(ad._id || ad.id)}
                                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="font-medium text-gray-900 dark:text-white">{ad.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const ServiceManagement = () => {
    const { services, addService, updateService, deleteService } = useData();
    const { t } = useLanguage();
    const [view, setView] = useState('list');
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        address: '',
        mobile: ''
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            image: service.image,
            address: service.address || '',
            mobile: service.mobile || ''
        });
        setView('form');
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('Are you sure you want to delete this service?'))) {
            try {
                await deleteService(id);
                alert(t('Service deleted successfully!'));
            } catch (error) {
                console.error('Error deleting service:', error);
                const errorMessage = error.response?.data?.message || error.message || t('Failed to delete service.');
                alert(errorMessage);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingService) {
                await updateService({ ...editingService, ...formData });
                alert(t('Service updated successfully!'));
            } else {
                await addService(formData);
                alert(t('Service added successfully!'));
            }
            setFormData({ name: '', description: '', image: '', address: '', mobile: '' });
            setEditingService(null);
            setView('list');
        } catch (error) {
            console.error('Error saving service:', error);
            const errorMessage = error.response?.data?.message || error.message || t('Failed to save service.');
            alert(errorMessage);
        }
    };

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {view === 'list' ? t('Service Management') : editingService ? t('Edit Service') : t('Add New Service')}
                </h2>
                <button
                    onClick={() => {
                        if (view === 'list') {
                            setEditingService(null);
                            setFormData({ name: '', description: '', image: '', address: '', mobile: '' });
                            setView('form');
                        } else {
                            setView('list');
                        }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    {view === 'list' ? <Plus size={20} /> : <List size={20} />}
                    {view === 'list' ? t('Add Service') : t('View List')}
                </button>
            </div>

            {view === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                        <div key={service._id || service.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
                            <div className="h-48 overflow-hidden relative">
                                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-blue-600 hover:text-blue-700 shadow-sm"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service._id || service.id)}
                                        className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-red-600 hover:text-red-700 shadow-sm"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{service.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>{service.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} />
                                        <span>{service.mobile}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Service Name')}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Image')}</label>
                            <div className="flex items-center gap-4">
                                {formData.image && (
                                    <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                                )}
                                <label className="flex-1 cursor-pointer">
                                    <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                        <Upload size={20} />
                                        <span>{t('Upload Image')}</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        required={!formData.image}
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Description')}</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Address')}</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Mobile Number')}</label>
                                <input
                                    type="text"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Save size={20} />
                                {editingService ? t('Update Service') : t('Add Service')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
