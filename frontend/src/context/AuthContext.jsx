// In frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // 1. Add loading state

    useEffect(() => {
        const checkAuthStatus = async () => {
            if (!token) {
                setLoading(false); // If no token, we're done loading
                return;
            }
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                const response = await apiClient.get('/user');
                setUser(response.data);
            } catch (error) {
                console.error("Auth check failed, logging out.", error);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false); // 2. Set loading to false after the check is complete
            }
        };
        checkAuthStatus();
    }, [token]);

    const login = async (credentials) => {
        const response = await apiClient.post('/login', credentials);
        const { access_token, user: loggedInUser } = response.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setUser(loggedInUser);
        navigate('/products'); 
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        // 3. Provide the loading state
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};