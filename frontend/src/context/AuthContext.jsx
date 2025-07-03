import { Children, createContext , useContext , useEffect, useState } from "react";
import apiClient from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext  = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user , setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize token from localStorage to presist login across page refreshes
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const checkAuthStatus = async () => {
            const storedToken = localStorage.getItem('token');

            if (!storedToken) {
                setLoading(false);
                return;
            }

            apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            try {
                const response = await apiClient.get('/user');
                setUser(response.data);
            } catch (error) {
                console.error("Auth verification failed:", error);
                localStorage.removeItem('token');
                setToken(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);



    if(token){
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const login = async (credentials) => {
        const response = await apiClient.post('/login', credentials);
        const { access_token, user } = response.data;
        setToken(access_token);
        setUser(user);
        localStorage.setItem('token',access_token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        navigate('/products'); // Redirect after log in 
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        delete apiClient.defaults.headers.common['Authorization'];
        navigate('/login'); // Redirect after log out
    };

    const value = {
        user,
        token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

// Custom hook to easily use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
}