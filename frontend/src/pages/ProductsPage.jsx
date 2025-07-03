import { useState , useEffect } from "react";
import apiClient from "../api/axios"; // Ensure this path is correct based on your project structure
import { Link } from "react-router-dom";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Make the GET request using our apiClient
                const response = await apiClient.get('/products');
                // Update state with the fetched data
                setProducts(response.data);
            }catch (err){
                // If an error occurs, update the error state 
               setError("Failed to fetch products. Please try again later.");
               console.error(err);
            }finally{
                // Set loading to false after the request completes 
                setLoading(false);
            }
        };
        fetchProducts(); // Call the function to fetch products
    }, []) // [] Empty dependency array means this effect runs once after the initial render

    // Conditional rendering based on state
    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h2> Products </h2>
            <div className="product-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {products.length > 0 ? (
                     products.map(product => (
                        <Link key={product.id} to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }} >
                            <div className="product-card" style={{ border: '1px solid #ccc', padding: '1rem' }}>
                                <h3>{product.name}</h3>
                                {/* This works because of our eager loading on the backend! */}
                                <p><strong>Category:</strong> {product.category.name}</p>
                                <p><strong>Price:</strong> ${product.price}</p>
                                <p><strong>In Stock:</strong> {product.stock_quantity}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );

};

export default ProductsPage;