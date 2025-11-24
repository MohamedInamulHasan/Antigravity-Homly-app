import { useState } from 'react';
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
    Image as ImageIcon
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            case 'ads':
                return <AdsManagement />;
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
                        Admin Panel
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarItem
                        icon={<Package size={20} />}
                        label="Products"
                        active={activeTab === 'products'}
                        onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<Store size={20} />}
                        label="Stores"
                        active={activeTab === 'stores'}
                        onClick={() => { setActiveTab('stores'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<Newspaper size={20} />}
                        label="News & Offers"
                        active={activeTab === 'news'}
                        onClick={() => { setActiveTab('news'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<ShoppingBag size={20} />}
                        label="Orders"
                        active={activeTab === 'orders'}
                        onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<Users size={20} />}
                        label="Users"
                        active={activeTab === 'users'}
                        onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }}
                    />
                    <SidebarItem
                        icon={<ImageIcon size={20} />}
                        label="Ads Slider"
                        active={activeTab === 'ads'}
                        onClick={() => { setActiveTab('ads'); setIsMobileMenuOpen(false); }}
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
    const { products, addProduct, updateProduct, deleteProduct } = useData();
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        title_ta: '',
        price: '',
        category: '',
        category_ta: '',
        description: '',
        description_ta: '',
        image: '',
        sliderImages: []
    });

    const handleImageUpload = (e, isSlider = false) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            if (isSlider) {
                const newImages = files.map(file => URL.createObjectURL(file));
                setFormData(prev => ({ ...prev, sliderImages: [...prev.sliderImages, ...newImages] }));
            } else {
                const imageUrl = URL.createObjectURL(files[0]);
                setFormData(prev => ({ ...prev, image: imageUrl }));
            }
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
            title_ta: product.title_ta || '',
            price: product.price,
            category: product.category,
            category_ta: product.category_ta || '',
            description: product.description,
            description_ta: product.description_ta || '',
            image: product.image || (product.images && product.images[0]) || '',
            sliderImages: product.images || []
        });
        setView('form');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
            alert('Product deleted successfully!');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            images: formData.sliderImages.length > 0 ? formData.sliderImages : [formData.image]
        };

        if (editingProduct) {
            updateProduct({ ...editingProduct, ...productData });
            alert('Product updated successfully!');
        } else {
            addProduct(productData);
            alert('Product uploaded successfully!');
        }
        setFormData({ title: '', title_ta: '', price: '', category: '', category_ta: '', description: '', description_ta: '', image: '', sliderImages: [] });
        setEditingProduct(null);
        setView('list');
    };

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {view === 'list' ? 'Product Inventory' : editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                    onClick={() => {
                        if (view === 'list') {
                            setEditingProduct(null);
                            setFormData({ title: '', title_ta: '', price: '', category: '', category_ta: '', description: '', description_ta: '', image: '', sliderImages: [] });
                            setView('form');
                        } else {
                            setView('list');
                        }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    {view === 'list' ? <Plus size={20} /> : <List size={20} />}
                    {view === 'list' ? 'Add Product' : 'View List'}
                </button>
            </div>

            {view === 'list' ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Image</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Title</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
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
                                                    onClick={() => handleDelete(product.id)}
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
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., Wireless Headphones"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Title (Tamil)</label>
                                <input
                                    type="text"
                                    value={formData.title_ta}
                                    onChange={(e) => setFormData({ ...formData, title_ta: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., வயர்லெஸ் ஹெட்ஃபோன்கள்"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Home">Home</option>
                                    <option value="Beauty">Beauty</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Image</label>
                                <div className="flex items-center gap-4">
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                            <Upload size={20} />
                                            <span>Upload Image</span>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slider Images (Optional)</label>
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Product description..."
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (Tamil)</label>
                            <textarea
                                value={formData.description_ta}
                                onChange={(e) => setFormData({ ...formData, description_ta: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Product description in Tamil..."
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                {editingProduct ? <Save size={20} /> : <Plus size={20} />}
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const StoreManagement = () => {
    const { stores, products, addStore, updateStore, addProduct, updateProduct, deleteProduct, deleteStore } = useData();
    const [view, setView] = useState('list'); // 'list', 'form', 'storeProducts', 'addProductToStore', 'editProduct'
    const [selectedStore, setSelectedStore] = useState(null);
    const [editingStore, setEditingStore] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [storeForm, setStoreForm] = useState({
        name: '',
        name_ta: '',
        location: '',
        location_ta: '',
        image: '',
        rating: 4.5
    });
    const [productForm, setProductForm] = useState({
        title: '',
        title_ta: '',
        price: '',
        category: '',
        category_ta: '',
        description: '',
        description_ta: '',
        image: '',
        sliderImages: []
    });

    const handleStoreImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setStoreForm({ ...storeForm, image: imageUrl });
        }
    };

    const handleProductImageUpload = (e, isSlider = false) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            if (isSlider) {
                const newImages = files.map(file => URL.createObjectURL(file));
                setProductForm(prev => ({ ...prev, sliderImages: [...prev.sliderImages, ...newImages] }));
            } else {
                const imageUrl = URL.createObjectURL(files[0]);
                setProductForm(prev => ({ ...prev, image: imageUrl }));
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
            name_ta: store.name_ta || '',
            location: store.location,
            location_ta: store.location_ta || '',
            image: store.image,
            rating: store.rating
        });
        setView('form');
    };

    const handleDeleteStore = (id) => {
        if (window.confirm('Are you sure you want to delete this store?')) {
            deleteStore(id);
            alert('Store deleted successfully!');
        }
    };

    const handleStoreSubmit = (e) => {
        e.preventDefault();
        if (editingStore) {
            updateStore({ ...editingStore, ...storeForm });
            alert('Store updated successfully!');
        } else {
            addStore(storeForm);
            alert('Store added successfully!');
        }
        setStoreForm({ name: '', name_ta: '', location: '', location_ta: '', image: '', rating: 4.5 });
        setEditingStore(null);
        setView('list');
    };

    const handleManageProducts = (store) => {
        setSelectedStore(store);
        setView('storeProducts');
    };

    const handleAddProductToStore = () => {
        setProductForm({ title: '', title_ta: '', price: '', category: '', category_ta: '', description: '', description_ta: '', image: '', sliderImages: [] });
        setEditingProduct(null);
        setView('addProductToStore');
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            title: product.title,
            title_ta: product.title_ta || '',
            price: product.price,
            category: product.category,
            category_ta: product.category_ta || '',
            description: product.description,
            description_ta: product.description_ta || '',
            image: product.image,
            sliderImages: product.images || []
        });
        setView('addProductToStore'); // Reusing the add form for editing
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(productId);
            alert('Product deleted successfully!');
        }
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...productForm,
            price: parseFloat(productForm.price),
            storeId: selectedStore.id,
            images: productForm.sliderImages.length > 0 ? productForm.sliderImages : [productForm.image] // Use slider images if available, else main image
        };

        if (editingProduct) {
            updateProduct({ ...editingProduct, ...productData });
            alert('Product updated successfully!');
        } else {
            addProduct(productData);
            alert('Product added to store successfully!');
        }
        setView('storeProducts');
    };

    return (
        <div className="max-w-6xl">
            {view === 'list' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Store Management</h2>
                        <button
                            onClick={() => setView('form')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={20} />
                            Add Store
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.map(store => (
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
                                            onClick={() => handleDeleteStore(store.id)}
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
                                        {store.location}
                                    </p>
                                    <button
                                        onClick={() => handleManageProducts(store)}
                                        className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                                    >
                                        Manage Products
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
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{editingStore ? 'Edit Store' : 'Add New Store'}</h2>
                    </div>
                    <form onSubmit={handleStoreSubmit} className="space-y-6">
                        {/* Store Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Name</label>
                                <input
                                    type="text"
                                    value={storeForm.name}
                                    onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Name (Tamil)</label>
                                <input
                                    type="text"
                                    value={storeForm.name_ta}
                                    onChange={(e) => setStoreForm({ ...storeForm, name_ta: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={storeForm.location}
                                    onChange={(e) => setStoreForm({ ...storeForm, location: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location (Tamil)</label>
                                <input
                                    type="text"
                                    value={storeForm.location_ta}
                                    onChange={(e) => setStoreForm({ ...storeForm, location_ta: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Image</label>
                                <div className="flex items-center gap-4">
                                    {storeForm.image && (
                                        <img src={storeForm.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                            <Upload size={20} />
                                            <span>Upload Image</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleStoreImageUpload} className="hidden" required={!storeForm.image} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Save size={20} />
                                {editingStore ? 'Update Store' : 'Add Store'}
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
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage Products</p>
                        </div>
                        <button
                            onClick={handleAddProductToStore}
                            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm md:text-base"
                        >
                            <Plus size={20} />
                            Add Product
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Image</th>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Title</th>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                                        <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {products.filter(p => p.storeId === selectedStore.id).map(product => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
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
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.filter(p => p.storeId === selectedStore.id).length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">
                                                No products found in this store. Add one to get started!
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
                            {editingProduct ? 'Edit Product' : `Add Product to ${selectedStore?.name}`}
                        </h2>
                    </div>
                    <form onSubmit={handleProductSubmit} className="space-y-6">
                        {/* Product Form Fields - Similar to ProductManagement but with slider images */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Title</label>
                                <input
                                    type="text"
                                    value={productForm.title}
                                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Title (Tamil)</label>
                                <input
                                    type="text"
                                    value={productForm.title_ta}
                                    onChange={(e) => setProductForm({ ...productForm, title_ta: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <select
                                    value={productForm.category}
                                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Home">Home</option>
                                    <option value="Beauty">Beauty</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Image</label>
                                <div className="flex items-center gap-4">
                                    {productForm.image && (
                                        <img src={productForm.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                            <Upload size={20} />
                                            <span>Upload Image</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={(e) => handleProductImageUpload(e, false)} className="hidden" required={!productForm.image} />
                                    </label>
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slider Images (Optional)</label>
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea
                                value={productForm.description}
                                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (Tamil)</label>
                            <textarea
                                value={productForm.description_ta}
                                onChange={(e) => setProductForm({ ...productForm, description_ta: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Plus size={20} />
                                {editingProduct ? 'Update Product' : 'Add Product to Store'}
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
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [editingNews, setEditingNews] = useState(null);
    const [newsForm, setNewsForm] = useState({
        headline: '',
        headline_ta: '',
        type: 'Offer',
        type_ta: '',
        image: '',
        content: '',
        content_ta: ''
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
            headline_ta: item.title_ta || '',
            type: item.category, // Map category to type
            type_ta: item.category_ta || '',
            image: item.image,
            content: item.description, // Map description to content
            content_ta: item.description_ta || ''
        });
        setView('form');
    };

    const handleDeleteNews = (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deleteNews(id);
            alert('Post deleted successfully!');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newsItem = {
            title: newsForm.headline,
            title_ta: newsForm.headline_ta,
            category: newsForm.type,
            category_ta: newsForm.type_ta,
            image: newsForm.image,
            description: newsForm.content,
            description_ta: newsForm.content_ta,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        if (editingNews) {
            updateNews({ ...editingNews, ...newsItem });
            alert('News updated successfully!');
        } else {
            addNews(newsItem);
            alert('News published successfully!');
        }
        setNewsForm({ headline: '', headline_ta: '', type: 'Offer', type_ta: '', image: '', content: '', content_ta: '' });
        setEditingNews(null);
        setView('list');
    };

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {view === 'list' ? 'News & Offers' : editingNews ? 'Edit Post' : 'Publish News & Offers'}
                </h2>
                <button
                    onClick={() => {
                        if (view === 'list') {
                            setEditingNews(null);
                            setNewsForm({ headline: '', headline_ta: '', type: 'Offer', type_ta: '', image: '', content: '', content_ta: '' });
                            setView('form');
                        } else {
                            setView('list');
                        }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    {view === 'list' ? <Plus size={20} /> : <List size={20} />}
                    {view === 'list' ? 'Add Post' : 'View List'}
                </button>
            </div>

            {view === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {news.map(item => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group relative">
                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEditNews(item); }}
                                    className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-blue-600 hover:text-blue-700 shadow-sm"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteNews(item.id); }}
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
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Headline</label>
                            <input
                                type="text"
                                value={newsForm.headline}
                                onChange={(e) => setNewsForm({ ...newsForm, headline: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Headline (Tamil)</label>
                            <input
                                type="text"
                                value={newsForm.headline_ta}
                                onChange={(e) => setNewsForm({ ...newsForm, headline_ta: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Headline in Tamil..."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                                <select
                                    value={newsForm.type}
                                    onChange={(e) => setNewsForm({ ...newsForm, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option>Offer</option>
                                    <option>News</option>
                                    <option>Deal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type (Tamil)</label>
                                <input
                                    type="text"
                                    value={newsForm.type_ta}
                                    onChange={(e) => setNewsForm({ ...newsForm, type_ta: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., சலுகை"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Post Image</label>
                                <div className="flex items-center gap-4">
                                    {newsForm.image && (
                                        <img src={newsForm.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                                    )}
                                    <label className="flex-1 cursor-pointer">
                                        <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                            <Upload size={20} />
                                            <span>Upload Image</span>
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                            <textarea
                                rows="5"
                                value={newsForm.content}
                                onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content (Tamil)</label>
                            <textarea
                                rows="5"
                                value={newsForm.content_ta}
                                onChange={(e) => setNewsForm({ ...newsForm, content_ta: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Content in Tamil..."
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                {editingNews ? <Save size={20} /> : <Newspaper size={20} />}
                                {editingNews ? 'Update Post' : 'Publish'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const OrderManagement = () => {
    const { orders, updateOrder } = useData();
    const [editingOrder, setEditingOrder] = useState(null);
    const [editAddress, setEditAddress] = useState('');

    const updateStatus = (id, newStatus) => {
        const order = orders.find(o => o.id === id);
        if (order) {
            updateOrder({ ...order, status: newStatus });
        }
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order.id);
        setEditAddress(order.address);
    };

    const saveOrder = (id) => {
        const order = orders.find(o => o.id === id);
        if (order) {
            updateOrder({ ...order, address: editAddress });
            setEditingOrder(null);
        }
    };

    return (
        <div className="max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Orders</h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Address</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                                <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="p-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{order.user}</td>
                                    <td className="p-4 text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                                        {editingOrder === order.id ? (
                                            <input
                                                type="text"
                                                value={editAddress}
                                                onChange={(e) => setEditAddress(e.target.value)}
                                                className="w-full px-2 py-1 border rounded"
                                            />
                                        ) : (
                                            <span className="truncate block">{order.address}</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-500 dark:text-gray-400">{order.date}</td>
                                    <td className="p-4 font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option>Pending</option>
                                            <option>Shipped</option>
                                            <option>Delivered</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        {editingOrder === order.id ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => saveOrder(order.id)} className="text-green-600 hover:text-green-700"><CheckCircle size={18} /></button>
                                                <button onClick={() => setEditingOrder(null)} className="text-red-600 hover:text-red-700"><XCircle size={18} /></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleEditOrder(order)} className="text-blue-600 hover:text-blue-700">
                                                <Edit2 size={18} />
                                            </button>
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

const UserManagement = () => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', address: '123 Main St, New York, NY', orders: 12 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', address: '456 Oak Ave, Los Angeles, CA', orders: 5 },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', address: '789 Pine Ln, Chicago, IL', orders: 8 },
    ];

    return (
        <div className="max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Database</h2>
            <div className="grid gap-6">
                {users.map(user => (
                    <div key={user.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-start justify-between">
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
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <MapPin size={14} />
                                    {user.address}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user.orders}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Orders</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdsManagement = () => {
    const { ads, addAd, deleteAd } = useData();
    const [newAdUrl, setNewAdUrl] = useState('');
    const [newAdTitle, setNewAdTitle] = useState('');

    const handleAdImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setNewAdUrl(imageUrl);
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

    return (
        <div className="max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ads Slider Management</h2>

            {/* Add New Ad Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Ad Image</h3>
                <form onSubmit={handleAddAd} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ad Image</label>
                        <div className="flex items-center gap-4">
                            {newAdUrl && (
                                <img src={newAdUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                            )}
                            <label className="flex-1 cursor-pointer">
                                <div className="w-full px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                    <Upload size={20} />
                                    <span>Upload Image</span>
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title (Optional)</label>
                        <input
                            type="text"
                            value={newAdTitle}
                            onChange={(e) => setNewAdTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ad Title"
                        />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 h-[42px]">
                        <Plus size={20} /> Add
                    </button>
                </form>
            </div>

            {/* Ads List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map(ad => (
                    <div key={ad.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group relative">
                        <div className="aspect-video relative">
                            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => deleteAd(ad.id)}
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

export default AdminDashboard;
