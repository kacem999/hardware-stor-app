import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Fetch user info if it's not already loaded
            if (!user) {
                apiClient.get('/user').then(response => setUser(response.data));
            }
        } else {
            delete apiClient.defaults.headers.common['Authorization'];
        }
    }, [token, user]);

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
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};