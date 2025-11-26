import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language');
        return saved || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        // Update html lang attribute
        document.documentElement.lang = language;
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ta' : 'en');
    };

    const translations = {
        'Home': { en: 'Home', ta: 'முகப்பு' },
        'Store': { en: 'Store', ta: 'கடை' },
        'Orders': { en: 'Orders', ta: 'ஆர்டர்கள்' },
        'Profile': { en: 'Profile', ta: 'சுயவிவரம்' },
        'Cart': { en: 'Cart', ta: 'கூடை' },
        'Checkout': { en: 'Checkout', ta: 'செக்அவுட்' },
        'Admin': { en: 'Admin', ta: 'நிர்வாகம்' },
        'Categories': { en: 'Categories', ta: 'வகைகள்' },
        'Search': { en: 'Search', ta: 'தேடுக' },
        'Add to Cart': { en: 'Add to Cart', ta: 'கூடையில் சேர்' },
        'Buy Now': { en: 'Buy Now', ta: 'இப்போதே வாங்கு' },
        'Place Order': { en: 'Place Order', ta: 'ஆர்டர் செய்' },
        'Confirm Order': { en: 'Confirm Order', ta: 'ஆர்டரை உறுதிப்படுத்து' },
        'Total': { en: 'Total', ta: 'மொத்தம்' },
        'Price': { en: 'Price', ta: 'விலை' },
        'Quantity': { en: 'Quantity', ta: 'அளவு' },
        'Subtotal': { en: 'Subtotal', ta: 'கூட்டுத்தொகை' },
        'Shipping': { en: 'Shipping', ta: 'கப்பல் போக்குவரத்து' },
        'Tax': { en: 'Tax', ta: 'வரி' },
        'Free': { en: 'Free', ta: 'இலவசம்' },
        'Proceed to Checkout': { en: 'Proceed to Checkout', ta: 'செக்அவுட் தொடரவும்' },
        'Continue Shopping': { en: 'Continue Shopping', ta: 'ஷாப்பிங் தொடரவும்' },
        'Your cart is empty': { en: 'Your cart is empty', ta: 'உங்கள் கூடை காலியாக உள்ளது' },
        'Start Shopping': { en: 'Start Shopping', ta: 'ஷாப்பிங் தொடங்கவும்' },
        'Order Summary': { en: 'Order Summary', ta: 'ஆர்டர் சுருக்கம்' },
        'Shipping Address': { en: 'Shipping Address', ta: 'கப்பல் முகவரி' },
        'Payment Method': { en: 'Payment Method', ta: 'கட்டண முறை' },
        'Full Name': { en: 'Full Name', ta: 'முழு பெயர்' },
        'Address': { en: 'Address', ta: 'முகவரி' },
        'City': { en: 'City', ta: 'நகரம்' },
        'Pincode': { en: 'Pincode', ta: 'அஞ்சல் குறியீடு' },
        'Mobile Number': { en: 'Mobile Number', ta: 'மொபைல் எண்' },
        'Back': { en: 'Back', ta: 'பின்னால்' },
        'Back to Cart': { en: 'Back to Cart', ta: 'கூடைக்குத் திரும்பு' },
        'Back to Store': { en: 'Back to Store', ta: 'கடைக்குத் திரும்பு' },
        'Product not found': { en: 'Product not found', ta: 'தயாரிப்பு கிடைக்கவில்லை' },
        'Return to Store': { en: 'Return to Store', ta: 'கடைக்குத் திரும்பு' },
        'Find a Store': { en: 'Find a Store', ta: 'கடையைக் கண்டுபிடி' },
        'Visit Store': { en: 'Visit Store', ta: 'கடைக்குச் செல்லவும்' },
        'No stores found': { en: 'No stores found', ta: 'கடைகள் எதுவும் இல்லை' },
        'Search products...': { en: 'Search products...', ta: 'தயாரிப்புகளைத் தேடுங்கள்...' },
        'Clear Filters': { en: 'Clear Filters', ta: 'வடிப்பான்களை அழி' },
        'All Products': { en: 'All Products', ta: 'அனைத்து தயாரிப்புகளும்' },
        'No products found': { en: 'No products found', ta: 'தயாரிப்புகள் எதுவும் இல்லை' },
        'Shop Now': { en: 'Shop Now', ta: 'இப்போதே வாங்கு' },
        'Quick Links': { en: 'Quick Links', ta: 'விரைவு இணைப்புகள்' },
        'Customer Service': { en: 'Customer Service', ta: 'வாடிக்கையாளர் சேவை' },
        'Contact Us': { en: 'Contact Us', ta: 'எங்களை தொடர்பு கொள்ள' },
        'About Us': { en: 'About Us', ta: 'எங்களை பற்றி' },
        'Contact': { en: 'Contact', ta: 'தொடர்பு' },
        'Privacy Policy': { en: 'Privacy Policy', ta: 'தனியுரிமைக் கொள்கை' },
        'Terms': { en: 'Terms', ta: 'விதிமுறைகள்' },
        'Privacy': { en: 'Privacy', ta: 'தனியுரிமை' },
        'Cookies': { en: 'Cookies', ta: 'குக்கிகள்' },
        'Login': { en: 'Login', ta: 'உள்நுழைய' },
        'Logout': { en: 'Logout', ta: 'வெளியேறு' },
        'My Profile': { en: 'My Profile', ta: 'என் சுயவிவரம்' },
        'Edit Profile': { en: 'Edit Profile', ta: 'சுயவிவரத்தைத் திருத்து' },
        'Save Changes': { en: 'Save Changes', ta: 'மாற்றங்களை சேமி' },
        'Cancel': { en: 'Cancel', ta: 'ரத்துசெய்' },
        'Order History': { en: 'Order History', ta: 'ஆர்டர் வரலாறு' },
        'Order ID': { en: 'Order ID', ta: 'ஆர்டர் ஐடி' },
        'Date': { en: 'Date', ta: 'தேதி' },
        'Status': { en: 'Status', ta: 'நிலை' },
        'View Details': { en: 'View Details', ta: 'விவரங்களைப் பார்' },
        'Processing': { en: 'Processing', ta: 'செயலாக்கத்தில்' },
        'Shipped': { en: 'Shipped', ta: 'அனுப்பப்பட்டது' },
        'Delivered': { en: 'Delivered', ta: 'வழங்கப்பட்டது' },
        'Cancelled': { en: 'Cancelled', ta: 'ரத்து செய்யப்பட்டது' },
        'Cash on Delivery': { en: 'Cash on Delivery', ta: 'பணம் செலுத்துதல்' },
        'Review Your Order': { en: 'Review Your Order', ta: 'உங்கள் ஆர்டரை மதிப்பாய்வு செய்யவும்' },
        'Order Placed!': { en: 'Order Placed!', ta: 'ஆர்டர் செய்யப்பட்டது!' },
        'Order Items': { en: 'Order Items', ta: 'ஆர்டர் பொருட்கள்' },
        'Thank you for your purchase. Your order has been confirmed and will be shipped soon.': { en: 'Thank you for your purchase. Your order has been confirmed and will be shipped soon.', ta: 'உங்கள் கொள்முதலுக்கு நன்றி. உங்கள் ஆர்டர் உறுதிப்படுத்தப்பட்டுள்ளது மற்றும் விரைவில் அனுப்பப்படும்.' },
        'Dashboard': { en: 'Dashboard', ta: 'டாஷ்போர்டு' },
        'Products': { en: 'Products', ta: 'தயாரிப்புகள்' },
        'Stores': { en: 'Stores', ta: 'கடைகள்' },
        'News & Offers': { en: 'News & Offers', ta: 'செய்திகள் மற்றும் சலுகைகள்' },
        'Users': { en: 'Users', ta: 'பயனர்கள்' },
        'Ads Slider': { en: 'Ads Slider', ta: 'விளம்பர ஸ்லைடர்' },
        'Admin Panel': { en: 'Admin Panel', ta: 'நிர்வாக குழு' },
        'Product Inventory': { en: 'Product Inventory', ta: 'தயாரிப்பு இருப்பு' },
        'Add New Product': { en: 'Add New Product', ta: 'புதிய தயாரிப்பைச் சேர்' },
        'Edit Product': { en: 'Edit Product', ta: 'தயாரிப்பைத் திருத்து' },
        'View List': { en: 'View List', ta: 'பட்டியலைப் பார்' },
        'Add Product': { en: 'Add Product', ta: 'தயாரிப்பைச் சேர்' },
        'Image': { en: 'Image', ta: 'படம்' },
        'Title': { en: 'Title', ta: 'தலைப்பு' },
        'Category': { en: 'Category', ta: 'வகை' },
        'Actions': { en: 'Actions', ta: 'செயல்கள்' },
        'Product Title': { en: 'Product Title', ta: 'தயாரிப்பு தலைப்பு' },
        'Product Title (Tamil)': { en: 'Product Title (Tamil)', ta: 'தயாரிப்பு தலைப்பு (தமிழ்)' },
        'Description': { en: 'Description', ta: 'விளக்கம்' },
        'Description (Tamil)': { en: 'Description (Tamil)', ta: 'விளக்கம் (தமிழ்)' },
        'Main Image': { en: 'Main Image', ta: 'முக்கிய படம்' },
        'Upload Image': { en: 'Upload Image', ta: 'படத்தை பதிவேற்றவும்' },
        'Slider Images (Optional)': { en: 'Slider Images (Optional)', ta: 'ஸ்லைடர் படங்கள் (விரும்பினால்)' },
        'Update Product': { en: 'Update Product', ta: 'தயாரிப்பைப் புதுப்பி' },
        'Store Management': { en: 'Store Management', ta: 'கடை மேலாண்மை' },
        'Add Store': { en: 'Add Store', ta: 'கடையைச் சேர்' },
        'Store Name': { en: 'Store Name', ta: 'கடை பெயர்' },
        'Store Name (Tamil)': { en: 'Store Name (Tamil)', ta: 'கடை பெயர் (தமிழ்)' },
        'Location': { en: 'Location', ta: 'இடம்' },
        'Location (Tamil)': { en: 'Location (Tamil)', ta: 'இடம் (தமிழ்)' },
        'Store Image': { en: 'Store Image', ta: 'கடை படம்' },
        'Update Store': { en: 'Update Store', ta: 'கடையைப் புதுப்பி' },
        'Manage Products': { en: 'Manage Products', ta: 'தயாரிப்புகளை நிர்வகி' },
        'Add Product to Store': { en: 'Add Product to Store', ta: 'கடைக்கு தயாரிப்பைச் சேர்' },
        'News Management': { en: 'News Management', ta: 'செய்தி மேலாண்மை' },
        'Add News': { en: 'Add News', ta: 'செய்திகளைச் சேர்' },
        'News Title': { en: 'News Title', ta: 'செய்தி தலைப்பு' },
        'News Title (Tamil)': { en: 'News Title (Tamil)', ta: 'செய்தி தலைப்பு (தமிழ்)' },
        'Type': { en: 'Type', ta: 'வகை' },
        'Content': { en: 'Content', ta: 'உள்ளடக்கம்' },
        'Content (Tamil)': { en: 'Content (Tamil)', ta: 'உள்ளடக்கம் (தமிழ்)' },
        'Order Management': { en: 'Order Management', ta: 'ஆர்டர் மேலாண்மை' },
        'User Management': { en: 'User Management', ta: 'பயனர் மேலாண்மை' },
        'Ads Management': { en: 'Ads Management', ta: 'விளம்பர மேலாண்மை' },
        'Select Category': { en: 'Select Category', ta: 'வகையைத் தேர்ந்தெடுக்கவும்' },
        'Product description...': { en: 'Product description...', ta: 'தயாரிப்பு விளக்கம்...' },
        'No products found in this store. Add one to get started!': { en: 'No products found in this store. Add one to get started!', ta: 'இந்த கடையில் தயாரிப்புகள் எதுவும் இல்லை. தொடங்க ஒன்றைச் சேர்க்கவும்!' },
        'Are you sure you want to delete this product?': { en: 'Are you sure you want to delete this product?', ta: 'இந்த தயாரிப்பை நிச்சயமாக நீக்க விரும்புகிறீர்களா?' },
        'Product deleted successfully!': { en: 'Product deleted successfully!', ta: 'தயாரிப்பு வெற்றிகரமாக நீக்கப்பட்டது!' },
        'Product updated successfully!': { en: 'Product updated successfully!', ta: 'தயாரிப்பு வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' },
        'Product uploaded successfully!': { en: 'Product uploaded successfully!', ta: 'தயாரிப்பு வெற்றிகரமாக பதிவேற்றப்பட்டது!' },
        'Store deleted successfully!': { en: 'Store deleted successfully!', ta: 'கடை வெற்றிகரமாக நீக்கப்பட்டது!' },
        'Store updated successfully!': { en: 'Store updated successfully!', ta: 'கடை வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' },
        'Store added successfully!': { en: 'Store added successfully!', ta: 'கடை வெற்றிகரமாக சேர்க்கப்பட்டது!' },
        'Product added to store successfully!': { en: 'Product added to store successfully!', ta: 'தயாரிப்பு கடைக்கு வெற்றிகரமாக சேர்க்கப்பட்டது!' },
        'Shop': { en: 'Shop', ta: 'கடை' },
        'FAQ': { en: 'FAQ', ta: 'அடிக்கடி கேட்கப்படும் கேள்விகள்' },
        'Shipping Policy': { en: 'Shipping Policy', ta: 'கப்பல் கொள்கை' },
        'Returns & Refunds': { en: 'Returns & Refunds', ta: 'திரும்பப் பெறுதல் & பணத்தைத் திரும்பப் பெறுதல்' },
        'All rights reserved': { en: 'All rights reserved', ta: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை' },
        'Search by store name or location...': { en: 'Search by store name or location...', ta: 'கடை பெயர் அல்லது இருப்பிடம் மூலம் தேடுங்கள்...' },
        'Try adjusting your search terms to find what you\'re looking for.': { en: 'Try adjusting your search terms to find what you\'re looking for.', ta: 'நீங்கள் தேடுவதைக் கண்டறிய உங்கள் தேடல் சொற்களைச் சரிசெய்ய முயற்சிக்கவும்.' },
        'Street Address': { en: 'Street Address', ta: 'தெரு முகவரி' },
        'State': { en: 'State', ta: 'மாநிலம்' },
        'Country': { en: 'Country', ta: 'நாடு' },
        'Including VAT': { en: 'Including VAT', ta: 'VAT உட்பட' },
        'Back to Edit': { en: 'Back to Edit', ta: 'திருத்தத்திற்குத் திரும்பு' },
        'City Name': { en: 'City Name', ta: 'நகரத்தின் பெயர்' },
        'John Doe': { en: 'John Doe', ta: 'ஜான் டோ' },
        '123 Main St': { en: '123 Main St', ta: '123 மெயின் செயின்ட்' },
        'Discount': { en: 'Discount', ta: 'தள்ளுபடி' },
        'more items': { en: 'more items', ta: 'மேலும் பொருட்கள்' },
        'Total Amount': { en: 'Total Amount', ta: 'மொத்த தொகை' },
        'Card': { en: 'Card', ta: 'அட்டை' },
        'ending in': { en: 'ending in', ta: 'முடிவடைகிறது' },
        'Store Timing': { en: 'Store Timing', ta: 'கடை நேரம்' },
        'Contact Number': { en: 'Contact Number', ta: 'தொடர்பு எண்' },
        'Mobile No': { en: 'Mobile No', ta: 'மொபைல் எண்' },
        'Summer Collection 2024': { en: 'Summer Collection 2024', ta: 'கோடைக்கால சேகரிப்பு 2024' },
        'Discover the latest trends in fashion.': { en: 'Discover the latest trends in fashion.', ta: 'ஃபேஷனின் சமீபத்திய போக்குகளைக் கண்டறியவும்.' },
        'Modern Electronics': { en: 'Modern Electronics', ta: 'நவீன எலக்ட்ரானிக்ஸ்' },
        'Upgrade your lifestyle with new tech.': { en: 'Upgrade your lifestyle with new tech.', ta: 'புதிய தொழில்நுட்பத்துடன் உங்கள் வாழ்க்கை முறையை மேம்படுத்தவும்.' },
        'Cozy Home Living': { en: 'Cozy Home Living', ta: 'வசதியான வீட்டு வாழ்க்கை' },
        'Make your home your sanctuary.': { en: 'Make your home your sanctuary.', ta: 'உங்கள் வீட்டை உங்கள் சரணாலயமாக மாற்றவும்.' },
        'Shop the latest trends': { en: 'Shop the latest trends', ta: 'சமீபத்திய போக்குகளை வாங்கவும்' },
        'Sports': { en: 'Sports', ta: 'விளையாட்டு' },
        'Toys': { en: 'Toys', ta: 'பொம்மைகள்' },
        'Books': { en: 'Books', ta: 'புத்தகங்கள்' },
        'Automotive': { en: 'Automotive', ta: 'வாகன' },
        'Manage and track your recent orders': { en: 'Manage and track your recent orders', ta: 'உங்கள் சமீபத்திய ஆர்டர்களை நிர்வகிக்கவும் மற்றும் கண்காணிக்கவும்' },
        'Search orders...': { en: 'Search orders...', ta: 'ஆர்டர்களைத் தேடுங்கள்...' },
        'Delete Order': { en: 'Delete Order', ta: 'ஆர்டரை நீக்கு' },
        'Cancel Order': { en: 'Cancel Order', ta: 'ஆர்டரை ரத்துசெய்' },
        'Are you sure you want to delete this order? This action cannot be undone.': { en: 'Are you sure you want to delete this order? This action cannot be undone.', ta: 'இந்த ஆர்டரை நிச்சயமாக நீக்க விரும்புகிறீர்களா? இந்த செயலை செயல்தவிர்க்க முடியாது.' },
        'Delete': { en: 'Delete', ta: 'நீக்கு' },
        'Headline': { en: 'Headline', ta: 'தலைப்புச் செய்தி' },
        'Headline (Tamil)': { en: 'Headline (Tamil)', ta: 'தலைப்புச் செய்தி (தமிழ்)' },
        'Publish News & Offers': { en: 'Publish News & Offers', ta: 'செய்திகள் மற்றும் சலுகைகளை வெளியிடுங்கள்' },
        'Edit Post': { en: 'Edit Post', ta: 'இடுகையைத் திருத்து' },
        'Publish': { en: 'Publish', ta: 'வெளியிடு' },
        'Update Post': { en: 'Update Post', ta: 'இடுகையைப் புதுப்பி' },
        'Add Post': { en: 'Add Post', ta: 'இடுகையைச் சேர்' },
        'Manage Orders': { en: 'Manage Orders', ta: 'ஆர்டர்களை நிர்வகி' },
        'Customer': { en: 'Customer', ta: 'வாடிக்கையாளர்' },
        'Pending': { en: 'Pending', ta: 'நிலுவையில் உள்ளது' },
        'User Database': { en: 'User Database', ta: 'பயனர் தரவுத்தளம்' },
        'Ads Slider Management': { en: 'Ads Slider Management', ta: 'விளம்பர ஸ்லைடர் மேலாண்மை' },
        'Add New Ad Image': { en: 'Add New Ad Image', ta: 'புதிய விளம்பரப் படத்தைச் சேர்' },
        'Ad Image': { en: 'Ad Image', ta: 'விளம்பரப் படம்' },
        'Title (Optional)': { en: 'Title (Optional)', ta: 'தலைப்பு (விரும்பினால்)' },
        'Ad Title': { en: 'Ad Title', ta: 'விளம்பரத் தலைப்பு' },
        'Add': { en: 'Add', ta: 'சேர்' },
        'Offer': { en: 'Offer', ta: 'சலுகை' },
        'News': { en: 'News', ta: 'செய்தி' },
        'Deal': { en: 'Deal', ta: 'ஒப்பந்தம்' },
        'All': { en: 'All', ta: 'அனைத்தும்' },
        'Active': { en: 'Active', ta: 'செயலில்' },
        'Completed': { en: 'Completed', ta: 'முடிந்தது' },
        'Try adjusting your search or filter to find what you\'re looking for.': { en: 'Try adjusting your search or filter to find what you\'re looking for.', ta: 'நீங்கள் தேடுவதைக் கண்டறிய உங்கள் தேடல் அல்லது வடிப்பானைச் சரிசெய்ய முயற்சிக்கவும்.' },
        'Electronics': { en: 'Electronics', ta: 'எலக்ட்ரானிக்ஸ்' },
        'Fashion': { en: 'Fashion', ta: 'ஃபேஷன்' },
        'Beauty': { en: 'Beauty', ta: 'அழகு' },
    };

    const t = (key, field = null) => {
        // Handle data object translation (e.g., t(product, 'title'))
        if (typeof key === 'object' && key !== null && field) {
            return (language === 'ta' && key[`${field}_ta`]) ? key[`${field}_ta`] : key[field];
        }

        // Handle static label translation
        if (!translations[key]) {
            console.warn(`Translation missing for key: "${key}"`);
            return key;
        }
        return translations[key][language] || translations[key]['en'] || key;
    };

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
