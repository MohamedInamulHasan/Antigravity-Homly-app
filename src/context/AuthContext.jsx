import { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                // Verify session with server instead of trust localStorage
                const data = await apiService.getProfile();
                setUser(data.data);
                // Keep userInfo in localStorage for non-auth UI sync if needed, or update it
                localStorage.setItem('userInfo', JSON.stringify(data.data));
            } catch (err) {
                // If 401/403, we are not logged in
                setUser(null);
                localStorage.removeItem('userInfo');
                localStorage.removeItem('authToken'); // Cleanup legacy token
            } finally {
                setLoading(false);
            }
        };
        checkUserLoggedIn();

        // Listen for global 401 unauthorized events from apiService
        const handleUnauthorized = () => {
            setUser(null);
            localStorage.removeItem('userInfo');
            localStorage.removeItem('authToken');
            window.dispatchEvent(new Event('userChanged'));
            // Optional: Redirect to login is handled by protected routes, or we can force it here
            if (!window.location.pathname.startsWith('/login')) {
                // window.location.href = '/login'; // Let the router handle it via valid state
            }
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const data = await apiService.login({ email, password });

            setUser(data.data);
            setUser(data.data);
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            // localStorage.setItem('authToken', data.data.token); // No longer storing token
            // Dispatch custom event to notify cart of user change
            window.dispatchEvent(new Event('userChanged'));
            return true;
        } catch (err) {
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : err.message
            );
            return false;
        }
    };

    const register = async (name, email, password, mobile) => {
        try {
            setError(null);
            const data = await apiService.register({ name, email, password, mobile });

            setUser(data.data);
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            // localStorage.setItem('authToken', data.data.token); // No longer storing token
            // Dispatch custom event to notify cart of user change
            window.dispatchEvent(new Event('userChanged'));
            return true;
        } catch (err) {
            setError(
                err.response && err.response.data.message
                    ? err.response.data.message
                    : err.message
            );
            return false;
        }
    };

    const logout = async () => {
        try {
            await apiService.logout();
        } catch (err) {
            console.error('Logout failed on server', err);
        }
        localStorage.removeItem('userInfo');
        localStorage.removeItem('authToken'); // Cleanup legacy
        setUser(null);
        // Dispatch custom event to notify cart of user change
        window.dispatchEvent(new Event('userChanged'));
    };

    const updateUserState = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, setUser: updateUserState, login, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
