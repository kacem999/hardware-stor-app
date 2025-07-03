import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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


    return (
        <nav style={navStyles}>
            <div style={linkContainerStyles}>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
            </div>
            <div style={linkContainerStyles}>
                {/* Render content conditionally */}
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