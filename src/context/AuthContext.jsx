import { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            // Optimistic UI: Load from localStorage first
            const storedUser = localStorage.getItem('userInfo');
            const storedToken = localStorage.getItem('authToken');

            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setLoading(false);
            }

            // Fallback: If no token is found locally, do NOT attempt to verify with server.
            // This prevents "Zombie Cookies" (which failed to clear on logout) from resurrecting the session.
            // Exception: If we are on Desktop and rely on Cookies only, this might be strict, 
            // but since we moved to Hybrid Auth, we expect a token.
            if (!storedToken && !storedUser) {
                setLoading(false);
                return;
            }

            try {
                // Verify session with server (works for both Cookie and Bearer Token)
                const data = await apiService.getProfile();

                // Update with fresh data from server
                setUser(data.data);
                localStorage.setItem('userInfo', JSON.stringify(data.data));
            } catch (err) {
                console.warn('Session verification failed:', err.message);
                // If token exists but failed, it might be expired
                if (err.response?.status === 401) {
                    setUser(null);
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('authToken');
                }
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
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            if (data.token) {
                localStorage.setItem('authToken', data.token); // Store token for Hybrid Auth
            }
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
            if (data.token) {
                localStorage.setItem('authToken', data.token); // Store token for Hybrid Auth
            }
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
