import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axios"; // Ensure this path is correct based on your project structure
import { useCart } from "../context/CartContext";

const ProductDetailPage = () => {

    const { addToCart } = useCart();
    const { id } = useParams(); // Get product ID from URL
    const [product , setProduct] = useState(null);
    const [loading , setLoading] = useState(true);
    const [error, setError] = useState(null); 

    // we will add the data fetching logic here 
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]); // Best Practice: Re-run effect if the ID changes 

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!product) return <div>No product found</div>;

    return (
        <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>In Stock: {product.stock_quantity}</p>
            <button onClick={() => {
                addToCart(product);
                alert(`${product.name} has been added to your cart!`);
            }}>
                Add to Cart</button>
        </div>
    );
};

export default ProductDetailPage;






































