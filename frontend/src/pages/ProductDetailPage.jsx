import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../api/axios"; // Ensure this path is correct based on your project structure
import { useCart } from "../context/CartContext";
import Currency from "../components/Currency"; // Import Currency component for price formatting
import ProductCard from "../components/ProductCard";


const ProductDetailPage = () => {

    const { addToCart } = useCart();
    const { id } = useParams(); // Get product ID from URL
    const [product , setProduct] = useState(null);
    const [loading , setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [addedToCart, setAddedToCart] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // we will add the data fetching logic here 
    useEffect(() => {
        const fetchProductAndRelated = async () => {
            setLoading(true);
            setError(null);
            try {
                
                const [productResponse, relatedResponse] = await Promise.all([
                    apiClient.get(`/products/${id}`),
                    apiClient.get(`/products/${id}/related`)
                ]);
                setProduct(productResponse.data);
                setRelatedProducts(relatedResponse.data);
            } catch (error) {
                setError('Failed to fetch product details.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductAndRelated();
    }, [id]); // Best Practice: Re-run effect if the ID changes 

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1, // Always add 1 quantity, users can modify in cart
            image: product.image
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000); // Hide message after 3 seconds
    };

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

        <div className="bg-slate-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Main Product Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 bg-white p-8 rounded-lg shadow-sm">
                    {/* Left column - Product Image */}
                    <div className="flex justify-center items-center bg-white p-4 rounded-lg">
                        <div className="w-full max-w-md h-96 flex items-center justify-center">
                            <img 
                                src={imageUrl} 
                                alt={product.name} 
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {e.target.src = 'https://placehold.co/600x400'}}
                            />
                        </div>
                    </div>
                    
                    {/* Right column - Product Details */}
                    <div>
                        <h1 className="text-3xl font-bold text-[#2b2a2a] mb-2">{product.name}</h1>
                        <Link to={`/products?category=${product.category_id}`} className="text-sm text-[#dc6b01] mb-4 inline-block">
                            {product.category?.name || 'Uncategorized'}
                        </Link>
                        
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold text-[#dc6b01]">
                                <Currency value={product.price} />
                            </h2>
                            <p className={`mt-1 text-sm ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </p>
                        </div>
                        
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-[#2b2a2a]">Description</h3>
                            <p className="mt-2 text-gray-600">{product.description}</p>
                        </div>
                        
                        {product.stock_quantity > 0 && (
                            <div className="mt-8">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-[#dc6b01] text-white px-6 py-3 rounded-md font-medium hover:bg-[#b55a01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc6b01]"
                                >
                                    Add to Cart
                                </button>
                                {addedToCart && (
                                    <div className="mt-3 text-sm text-green-600">
                                        Product added to cart! <Link to="/cart" className="underline font-medium">View cart</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(related => (
                                <ProductCard key={related.id} product={related} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;






































