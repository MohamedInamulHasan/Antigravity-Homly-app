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
import AdminDashboard from './pages/admin/AdminDashboard';
import MobileFooter from './components/MobileFooter';
import InstallPrompt from './components/InstallPrompt';
import { CartProvider } from './context/CartContext';

import ScrollToTop from './components/ScrollToTop';

const Layout = ({ children }) => {
    const location = useLocation();
    const hideMobileFooter = location.pathname.startsWith('/product/') ||
        location.pathname === '/checkout' ||
        location.pathname === '/order-confirmation' ||
        location.pathname === '/login' ||
        location.pathname === '/signup';

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <ScrollToTop />
            {!isAuthPage && <Navbar />}
            <main className={`flex-grow ${hideMobileFooter ? '' : 'pb-24'} md:pb-0`}>
                {children}
            </main>
            {!isAuthPage && <MobileFooter />}
            {!isAuthPage && <InstallPrompt />}
        </div>
    );
};

import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';

// ... existing imports ...

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
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
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;
