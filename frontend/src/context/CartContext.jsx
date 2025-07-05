import { createContext , useContext, useState , useEffect} from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Best practice: Initialize state from localStorage
        try{
            const localData = localStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        }catch (error) {
            consol.error("Could not parse cart data:", error);
            return [];
        }
    });

    // Best practice: Presist state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems))
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                // If the item aleardy exists in the cart, increase its quantity 
                return prevItems.map(item => 
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }else {

                return [...prevItems, {...product, quantity: 1}];
            }
        });
    };
    const value = {
        cartItems,
        addToCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;



};
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};



























