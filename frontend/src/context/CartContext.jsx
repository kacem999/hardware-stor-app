import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiClient from '../api/axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { token } = useAuth(); // Now this will work because AuthProvider is a parent

    // This effect handles all logic when authentication status changes
    useEffect(() => {
        const handleAuthChange = async () => {
            const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

            if (token) {
                try {
                    // User is logged in
                    if (guestCart.length > 0) {
                        const localCartForApi = guestCart.map(item => ({ product_id: item.id, quantity: item.quantity }));
                        await apiClient.post('/cart/merge', { localCart: localCartForApi });
                        localStorage.removeItem('guestCart');
                    }
                    const response = await apiClient.get('/cart');
                    const formattedCart = response.data.map(item => ({ ...item.product, quantity: item.quantity }));
                    setCartItems(formattedCart);
                } catch (error) {
                    console.error('Error fetching cart:', error);
                    // If there's an auth error, fall back to guest cart
                    if (error.response?.status === 401) {
                        setCartItems(guestCart);
                    }
                }
            } else {
                // User is a guest
                setCartItems(guestCart);
            }
        };
        handleAuthChange();
    }, [token]);

    // This effect ONLY saves the GUEST cart
    useEffect(() => {
        if (!token) {
            localStorage.setItem('guestCart', JSON.stringify(cartItems));
        }
    }, [cartItems, token]);

    const addToCart = async (product) => {
        if (token) {
            try {
                const response = await apiClient.post('/cart', { product_id: product.id, quantity: 1 });
                const serverCart = await apiClient.get('/cart');
                const formattedCart = serverCart.data.map(item => ({ ...item.product, quantity: item.quantity }));
                setCartItems(formattedCart);
            } catch (error) {
                console.error('Error adding to cart:', error);
                // If there's an auth error, fall back to guest cart behavior
                if (error.response?.status === 401) {
                    setCartItems(prevItems => {
                        const existingItem = prevItems.find(item => item.id === product.id);
                        if (existingItem) {
                            return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                        }
                        return [...prevItems, { ...product, quantity: 1 }];
                    });
                }
            }
        } else {
            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item.id === product.id);
                if (existingItem) {
                    return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                }
                return [...prevItems, { ...product, quantity: 1 }];
            });
        }
    };
    
    // This is needed for the logout process in AuthContext
    const clearCart = () => {
        setCartItems([]);
    }
    
    // We need to pass clearCart to AuthContext, but AuthContext shouldn't provide it.
    // The easiest way is to let AuthContext call it directly on logout.
    // However, the logout logic in AuthContext will trigger a token change, which already clears the cart.
    // So we just need to provide the main values.

    return (
        <CartContext.Provider value={{ cartItems, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};