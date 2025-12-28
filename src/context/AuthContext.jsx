import { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                setUser(JSON.parse(userInfo));
            }
            setLoading(false);
        };
        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const data = await apiService.login({ email, password });

            setUser(data.data);
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            localStorage.setItem('authToken', data.data.token);
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

    const register = async (name, email, password) => {
        try {
            setError(null);
            const data = await apiService.register({ name, email, password });

            setUser(data.data);
            localStorage.setItem('userInfo', JSON.stringify(data.data));
            localStorage.setItem('authToken', data.data.token);
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

    const logout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('authToken');
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
