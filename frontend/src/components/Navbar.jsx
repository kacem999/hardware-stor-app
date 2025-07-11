import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 

const Navbar = () => {
    const { user, logout } = useAuth(); // Access user and logout function from AuthContext
    const { cartItems } = useCart();

    // best practice: Calculate total quantity, not just array length 
    const totalItemsInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side links */}
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 font-bold">HardwareStore</Link>
                        <Link to="/products" className="text-gray-500 hover:text-blue-600">Products</Link>
                        {user && <Link to="/dashboard" className="text-gray-500 hover:text-blue-600">Dashboard</Link>}
                    </div>

                    {/* Right side links */}
                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="text-gray-500 hover:text-blue-600">
                            Cart ({totalItemsInCart})
                        </Link>
                        {user ? (
                            <>
                                <span className="text-gray-700">Hello, {user.name}</span>
                                <button onClick={logout} className="text-gray-500 hover:text-red-600">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-500 hover:text-blue-600">Login</Link>
                                <Link to="/register" className="text-gray-500 hover:text-blue-600">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;