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
    Trash2
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
    const { products, addProduct, updateProduct } = useData();
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
        image: ''
    });

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
            image: product.image || (product.images && product.images[0]) || ''
        });
        setView('form');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProduct) {
            // Update existing product
            updateProduct({ ...editingProduct, ...formData, images: [formData.image] });
            alert('Product updated successfully!');
        } else {
            // Add new product
            addProduct({ ...formData, images: [formData.image] });
            alert('Product uploaded successfully!');
        }
        setFormData({ title: '', title_ta: '', price: '', category: '', category_ta: '', description: '', description_ta: '', image: '' });
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
                            setFormData({ title: '', title_ta: '', price: '', category: '', category_ta: '', description: '', description_ta: '', image: '' });
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
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://..."
                                    required
                                />
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
    const { stores, addStore, updateStore, addProduct } = useData();
    const [view, setView] = useState('list'); // 'list', 'form', 'addProductToStore'
    const [selectedStore, setSelectedStore] = useState(null);
    const [editingStore, setEditingStore] = useState(null);
    const [storeForm, setStoreForm] = useState({
        name: '',
        name_ta: '',
        owner: '',
        email: '',
        phone: '',
        location: '',
        location_ta: '',
        image: ''
    });

    const handleEditStore = (store) => {
        setEditingStore(store);
        setStoreForm({
            name: store.name,
            name_ta: store.name_ta || '',
            owner: 'John Doe', // Mock data
            email: 'store@example.com', // Mock data
            phone: '123-456-7890', // Mock data
            location: store.location,
            location_ta: store.location_ta || '',
            image: store.image
        });
        setView('form');
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
        setStoreForm({ name: '', name_ta: '', owner: '', email: '', phone: '', location: '', location_ta: '', image: '' });
        setEditingStore(null);
        setView('list');
    };

    const handleAddProductToStore = (e) => {
        e.preventDefault();
        // Here we would typically add the product with the storeId
        // For now, we'll just use the addProduct function from context
        // You might want to extend addProduct to accept a storeId if your data model supports it
        alert(`Product added to ${selectedStore.name} successfully! (Mock - logic needs storeId support)`);
        setView('list');
        setSelectedStore(null);
    };

    return (
        <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {view === 'list' ? 'Store Management' : view === 'form' ? (editingStore ? 'Edit Store' : 'Register New Store') : `Add Product to ${selectedStore?.name}`}
                </h2>
                {view === 'list' && (
                    <button
                        onClick={() => {
                            setEditingStore(null);
                            setStoreForm({ name: '', name_ta: '', owner: '', email: '', phone: '', location: '', location_ta: '', image: '' });
                            setView('form');
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Register Store
                    </button>
                )}
                {view !== 'list' && (
                    <button
                        onClick={() => setView('list')}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Back to List
                    </button>
                )}
            </div>

            {view === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stores.map(store => (
                        <div key={store.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group relative">
                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEditStore(store); }}
                                    className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-blue-600 hover:text-blue-700 shadow-sm"
                                >
                                    <Edit2 size={18} />
                                </button>
                            </div>
                            <div className="h-48 overflow-hidden">
                                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{store.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex items-center gap-2">
                                    <MapPin size={16} />
                                    {store.location}
                                </p>
                                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedStore(store);
                                            setView('addProductToStore');
                                        }}
                                        className="flex-1 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Add Product
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'form' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <form onSubmit={handleStoreSubmit} className="space-y-6">
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
                                    placeholder="e.g., ஷாப்ஈஸ்"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Owner Name</label>
                                <input
                                    type="text"
                                    value={storeForm.owner}
                                    onChange={(e) => setStoreForm({ ...storeForm, owner: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={storeForm.email}
                                    onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={storeForm.phone}
                                    onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Address</label>
                            <textarea
                                rows="3"
                                value={storeForm.location}
                                onChange={(e) => setStoreForm({ ...storeForm, location: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Address (Tamil)</label>
                            <textarea
                                rows="3"
                                value={storeForm.location_ta}
                                onChange={(e) => setStoreForm({ ...storeForm, location_ta: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Store address in Tamil..."
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                {editingStore ? <Save size={20} /> : <Store size={20} />}
                                {editingStore ? 'Update Store' : 'Register Store'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {view === 'addProductToStore' && selectedStore && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <form onSubmit={handleAddProductToStore} className="space-y-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-6">
                            <p className="text-blue-800 dark:text-blue-300 font-medium">Adding product to: {selectedStore.name}</p>
                        </div>
                        {/* ... (Product Form fields same as ProductManagement) ... */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Title</label>
                                <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
                                <input type="number" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <select className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required>
                                    <option>Electronics</option>
                                    <option>Fashion</option>
                                    <option>Home</option>
                                    <option>Beauty</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                                <input type="url" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                            <textarea rows="4" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Plus size={20} />
                                Add Product to Store
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const NewsManagement = () => {
    const { news, addNews, updateNews } = useData();
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
                            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEditNews(item); }}
                                    className="p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full text-blue-600 hover:text-blue-700 shadow-sm"
                                >
                                    <Edit2 size={18} />
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={newsForm.image}
                                    onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
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

export default AdminDashboard;
