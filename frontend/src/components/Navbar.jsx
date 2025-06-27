import { Link } from 'react-router-dom';

const navStyles = {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc',
};

const Navbar = () => {
    return (
        <nav style={navStyles}>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </nav>
    );

}

export default Navbar;