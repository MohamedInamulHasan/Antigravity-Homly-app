// Helper function to get store name by storeId
// Add this to any component that needs to display store names
// Usage: const storeName = getStoreName(item.storeId, stores);

export const getStoreName = (storeId, stores) => {
    if (!storeId || !stores) return 'Unknown Store';
    const store = stores.find(s => (s._id || s.id) === storeId);
    return store?.name || 'Unknown Store';
};
