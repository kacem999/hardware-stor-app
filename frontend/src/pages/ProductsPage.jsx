import { useState, useEffect } from "react";
import apiClient from "../api/axios";
import Currency from "../components/Currency";
import ProductCard from "../components/ProductCard"; // 1. Import the new component

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient.get('/products');
                setProducts(response.data);
            } catch (err) {
                setError("Failed to fetch products. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center p-8">Loading products...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div className="bg-slate-50">
            {/* 2. Add a main container with responsive padding and centering */}
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">All Products</h2>

                {/* 3. Use CSS Grid for a responsive layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        // 4. Use the new ProductCard component
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;