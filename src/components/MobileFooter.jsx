import { Link, useLocation } from 'react-router-dom';
import { Home, Store, ShoppingCart, User, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MobileFooter = () => {
    const location = useLocation();
    const { cartCount } = useCart();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/store', icon: Store, label: 'Store' },
        { path: '/orders', icon: Package, label: 'Orders' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe z-50 transition-colors duration-200">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 ${active
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            <div className="relative">
                                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                                {item.path === '/cart' && cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white dark:border-gray-900">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileFooter;
