import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import StoreProducts from './pages/StoreProducts';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import OrderConfirmation from './pages/OrderConfirmation';
import News from './pages/News';
import Services from './pages/Services';
import SavedProducts from './pages/SavedProducts';
import AdminDashboard from './pages/admin/AdminDashboard';
import MobileFooter from './components/MobileFooter';
import InstallPrompt from './components/InstallPrompt';
import IntroAnimation from './components/IntroAnimation';
import { CartProvider } from './context/CartContext';
import { useData } from './context/DataContext';
import useBackButton from './utils/useBackButton';

import ScrollToTop from './components/ScrollToTop';

const Layout = ({ children, onRefresh }) => {
    const location = useLocation();
    // Use back button handler for Android navigation
    useBackButton();
    // Only hide footer on order confirmation and auth pages
    const hideMobileFooter = location.pathname === '/order-confirmation' ||
        location.pathname === '/login' ||
        location.pathname === '/signup';

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <ScrollToTop />
            {!isAuthPage && <Navbar />}
            <PullToRefresh onRefresh={onRefresh} resistance={2.5} className="flex-grow flex flex-col">
                <main className={`flex-grow ${hideMobileFooter ? '' : 'pb-32'} md:pb-0 min-h-screen`}>
                    {children}
                </main>
            </PullToRefresh>
            {!isAuthPage && <MobileFooter />}
            {!isAuthPage && <InstallPrompt />}
        </div>
    );
};

import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';

// ... existing imports ...

// ... existing imports ...

import PullToRefresh from 'react-simple-pull-to-refresh';

function App() {
    const { initialLoading, refreshData } = useData();

    const handleRefresh = async () => {
        if (refreshData) {
            await refreshData();
        }
    };

    return (
        <AuthProvider>
            <Router>
                {/* Show intro animation during initial load */}
                {initialLoading && <IntroAnimation />}

                {/* Main app content - hidden during intro */}
                <div style={{ display: initialLoading ? 'none' : 'block' }}>
                    <Layout onRefresh={handleRefresh}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/store" element={<Shop />} />
                            <Route path="/store/:id" element={<StoreProducts />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/product/:id" element={<ProductDetails />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/orders/:id" element={<OrderDetails />} />
                            <Route path="/order-confirmation" element={<OrderConfirmation />} />
                            <Route path="/news" element={<News />} />
                            <Route path="/news" element={<News />} />
                            <Route path="/saved-products" element={<SavedProducts />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                        </Routes>
                    </Layout>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
