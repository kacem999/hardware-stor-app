import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/axios"; // Ensure this path is correct based on your project structure
import { useCart } from "../context/CartContext";
import Currency from "../components/Currency"; // Import Currency component for price formatting

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

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!product) return <div className="text-center p-8">Product not found.</div>;
    
    // Handle image URL construction
    let imageUrl = 'https://placehold.co/600x400'; // Default fallback with larger dimensions for detail page
    
    if (product.image) {
        // If the image URL already starts with http, use it as is
        if (product.image.startsWith('http')) {
            imageUrl = product.image;
        } 
        // If it starts with /storage, prepend the base URL
        else if (product.image.startsWith('/storage')) {
            imageUrl = `http://127.0.0.1:8000${product.image}`;
        }
        // Otherwise, assume it's a relative path and construct accordingly
        else {
            imageUrl = `http://127.0.0.1:8000/storage/${product.image}`;
        }
    }

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    {/* Image Column */}
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
                        {/* Product image with proper sizing for detail view */}
                        <img src={imageUrl} alt={product.name} className="max-h-96 object-contain" />
                    </div>

                    {/* Details Column */}
                    <div className="flex flex-col justify-center">
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                            {product.category.name}
                        </p>
                        <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
                            {product.name}
                        </h1>
                        <p className="text-3xl text-gray-900 mt-4">
                            <Currency value={product.price} />
                        </p>
                        
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900">Description</h3>
                            <p className="text-base text-gray-600 mt-2">
                                {product.description || 'No description available.'}
                            </p>
                        </div>

                        <div className="mt-8">
                            <button 
                                onClick={() => {
                                    addToCart(product);
                                    alert(`${product.name} added to cart!`);
                                }}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;






































