import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi, getMe } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await getMe();
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            await loginApi(credentials);
            // Verify session is active before success
            const response = await getMe();
            setUser(response.data);
            toast.success('Logged in successfully');
            return true;
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const signup = async (userData) => {
        try {
            await registerApi(userData);
            // Verify session is active before success
            const response = await getMe();
            setUser(response.data);
            toast.success('Account created successfully');
            return true;
        } catch (error) {
            console.error("Signup Error:", error);
            toast.error(error.response?.data?.message || 'Signup failed');
            return false;
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
            setUser(null);
            toast.success('Logged out');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
