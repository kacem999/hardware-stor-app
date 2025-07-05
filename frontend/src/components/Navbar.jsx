import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 

const navStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc',
};

const linkContainerStyles = {
    display : 'flex',
    gap: '1rem',
}

const Navbar = () => {
    const { user, logout } = useAuth(); // Access user and logout function from AuthContext
    const { cartItems } = useCart();

    // best practice: Calculate total quantity, not just array length 
    const totalItemsInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav style={navStyles}>
            <div style={linkContainerStyles}>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                {user && <Link to="/dashboard">Dashboard</Link>}
            </div>
            <div style={linkContainerStyles}>
                {/* Render content conditionally */}
                <Link to="/cart">Cart ({totalItemsInCart})</Link>
                {user ? (
                    <>
                        <span>Hello, {user.name}!</span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;